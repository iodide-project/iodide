FROM python:3.7.3-alpine AS app-base

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

# Install Python dependencies
COPY requirements/*.txt /tmp/requirements/

WORKDIR /app
COPY . /app
RUN chown app:app -R .
USER app

# Using /bin/bash as the entrypoint works around some volume mount issues on Windows
# where volume-mounted files do not have execute bits set.
# https://github.com/docker/compose/issues/2301#issuecomment-154450785 has additional background.
ENTRYPOINT ["/bin/bash", "/app/bin/run"]

FROM app-base AS prod

ARG PIP_FILE=build.txt
RUN pip install --user --require-hashes --no-cache-dir -r /tmp/requirements/$PIP_FILE
RUN DEBUG=False SECRET_KEY=foo ./manage.py collectstatic --noinput -c
CMD ["prod"]

FROM app-base AS dev

ARG PIP_FILE=all.txt
RUN pip install --user --require-hashes --no-cache-dir -r /tmp/requirements/$PIP_FILE
RUN DEBUG=False SECRET_KEY=foo ./manage.py collectstatic --noinput -c
CMD ["dev"]