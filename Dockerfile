FROM python:3.8-slim AS python-builder

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
COPY requirements/*.txt ./requirements/
RUN pip install --require-hashes --no-cache-dir -r requirements/build.txt

FROM python:3.8-slim AS base

# install a few essentials and clean apt caches afterwards
RUN mkdir -p \
        /usr/share/man/man1 \
        /usr/share/man/man2 \
        /usr/share/man/man3 \
        /usr/share/man/man4 \
        /usr/share/man/man5 \
        /usr/share/man/man6 \
        /usr/share/man/man7 \
        /usr/share/man/man8 && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        apt-transport-https postgresql-client netcat build-essential git curl  && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PATH="/venv/bin:$PATH"
RUN echo export PATH="/venv/bin:\$PATH" > /etc/profile.d/venv.sh

RUN groupadd --gid 10001 app && useradd -g app --uid 10001 --shell /usr/sbin/nologin --create-home app

COPY --chown=app:app --from=python-builder /venv /venv

WORKDIR /app
COPY . /app

# Set user permissions
COPY --chown=app:app . .
RUN chown app /app
USER app

# Collect static files
RUN DEBUG=False SECRET_KEY=foo ./manage.py collectstatic --noinput -c

# Using /bin/bash as the entrypoint works around some volume mount issues on Windows
# where volume-mounted files do not have execute bits set.
# https://github.com/docker/compose/issues/2301#issuecomment-154450785 has additional background.
ENTRYPOINT ["/bin/bash", "/app/bin/run"]

EXPOSE 8000

FROM base AS devapp

# Install dev python dependencies
RUN pip install --require-hashes --no-cache-dir -r requirements/all.txt
USER app
