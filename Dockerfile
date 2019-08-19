FROM python:3.7.3-alpine AS app-base

ENV PATH="/app/.local/bin:$PATH"

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

WORKDIR /app
COPY . /app
RUN chown app:app -R .
USER app

COPY requirements/build.txt .requirements
RUN pip install --user --require-hashes --no-cache-dir -r requirements/build.txt

# Using /bin/bash as the entrypoint works around some volume mount issues on Windows
# where volume-mounted files do not have execute bits set.
# https://github.com/docker/compose/issues/2301#issuecomment-154450785 has additional background.
ENTRYPOINT ["/bin/bash", "/app/bin/run"]

FROM app-base AS dev

COPY requirements/all.txt requirements/tests.txt ./requirements/
RUN pip install --user --require-hashes --no-cache-dir -r requirements/all.txt
RUN DEBUG=False SECRET_KEY=foo ./manage.py collectstatic --noinput -c

