FROM python:3.7.3-alpine AS base

ENV PATH="/venv/bin:$PATH"

EXPOSE 8000

WORKDIR /app

RUN addgroup -g 10001 app && \
    adduser -D -u 10001 -G app -h /app -s /sbin/nologin app

RUN apk --no-cache --virtual add \
    build-base \
    bash \
    curl \
    git \
    libffi-dev \
    py-cffi \
    postgresql \
    postgresql-dev \ 
    postgresql-client

# Install virtualenv
RUN pip install virtualenv
RUN virtualenv /venv

WORKDIR /app
COPY . /app

FROM base AS devapp
RUN echo "Installing dev dependencies"

COPY requirements ./requirements/
RUN pip install --require-hashes --no-cache-dir -r requirements/all.txt
RUN DEBUG=False SECRET_KEY=foo ./manage.py collectstatic --noinput -c

# Using /bin/bash as the entrypoint works around some volume mount issues on Windows
# where volume-mounted files do not have execute bits set.
# https://github.com/docker/compose/issues/2301#issuecomment-154450785 has additional background.
ENTRYPOINT ["/bin/bash", "/app/bin/run"]

# Set User and user permissions
RUN chown app:app -R .
USER app

FROM base AS release
RUN echo "Installing prod dependencies"

COPY requirements/build.txt ./requirements/
RUN pip install --require-hashes --no-cache-dir -r requirements/build.txt
RUN DEBUG=False SECRET_KEY=foo ./manage.py collectstatic --noinput -c

ENTRYPOINT ["/bin/bash", "/app/bin/run"]

RUN chown app:app -R .
USER app
