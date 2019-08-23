ARG APP_ENV=dev

FROM python:3.7.3-alpine AS base

EXPOSE 8000

WORKDIR /app

RUN addgroup -g 10001 app && \
    adduser -D -u 10001 -G app -h /app -s /sbin/nologin app

RUN apk --no-cache add \
    build-base \
    bash \
    curl \
    git \
    libffi-dev \
    py-cffi \
    postgresql \
    postgresql-dev \
    postgresql-client

FROM base AS prod_preinstall
RUN echo "Installing prod dependencies"

COPY requirements/build.txt ./requirements/
RUN pip install --require-hashes --no-cache-dir -r requirements/build.txt

FROM base AS dev_preinstall
RUN echo "Installing dev dependencies"

COPY requirements/tests.txt ./requirements/
RUN pip install --require-hashes --no-cache-dir -r requirements/tests.txt
RUN DEBUG=False SECRET_KEY=foo ./manage.py collectstatic --noinput -c

FROM ${APP_ENV}_preinstall AS release
WORKDIR /app
COPY . /app
RUN chown app:app -R .
USER app
# Using /bin/bash as the entrypoint works around some volume mount issues on Windows
# where volume-mounted files do not have execute bits set.
# https://github.com/docker/compose/issues/2301#issuecomment-154450785 has additional background.
ENTRYPOINT ["/bin/bash", "/app/bin/run"]