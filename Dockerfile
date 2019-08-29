FROM python:3.7-slim AS python-builder

ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PATH="/venv/bin:$PATH"

WORKDIR /app

RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install \ 
    libpq-dev \
    libffi-dev \
    python-dev \
    build-essential

# Install virtualenv
RUN pip install virtualenv
RUN virtualenv /venv

# Install base python dependencies 
COPY requirements/build.txt ./requirements/
RUN pip install --require-hashes --no-cache-dir -r requirements/build.txt

FROM python-builder AS base

RUN groupadd --gid 10001 app && useradd -g app --uid 10001 --shell /usr/sbin/nologin app

COPY --from=python-builder /venv /venv

EXPOSE 8000

WORKDIR /app
COPY . /app

# Collect static files
RUN DEBUG=False SECRET_KEY=foo ./manage.py collectstatic --noinput -c

# Using /bin/bash as the entrypoint works around some volume mount issues on Windows
# where volume-mounted files do not have execute bits set.
# https://github.com/docker/compose/issues/2301#issuecomment-154450785 has additional background.
ENTRYPOINT ["/bin/bash", "/app/bin/run"]

FROM base AS release

COPY --from=base --chown=app:app /app/static /app/static

# Set user and user permissions
COPY --chown=app:app . . 
USER app

FROM base AS devapp

COPY --from=base --chown=app:app /venv /venv
COPY --from=base --chown=app:app /app/static /app/static 

# Install dev python dependencies
COPY requirements/tests.txt ./requirements/
RUN pip install --require-hashes --no-cache-dir -r requirements/tests.txt

USER app
