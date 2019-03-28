FROM python:3.7.3-alpine

# Default to building for local development.
# Override with `--build-arg PIP_FILE=build.txt` to build for production.
ARG PIP_FILE=all.txt

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
# Switch to /tmp to install dependencies outside home dir
WORKDIR /tmp
# TODO: Consider a way to install only the "build.txt" deps for production.
RUN pip install --require-hashes --no-cache-dir -r requirements/$PIP_FILE

WORKDIR /app
COPY . /app
RUN chown app:app -R .
USER app

RUN DEBUG=False SECRET_KEY=foo ./manage.py collectstatic --noinput -c

# Using /bin/bash as the entrypoint works around some volume mount issues on Windows
# where volume-mounted files do not have execute bits set.
# https://github.com/docker/compose/issues/2301#issuecomment-154450785 has additional background.
ENTRYPOINT ["/bin/bash", "/app/bin/run"]

CMD ["dev"]
