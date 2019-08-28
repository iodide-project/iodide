FROM python:3.8.0b3-slim-buster AS base

ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PATH="/venv/bin:$PATH"

EXPOSE 8000

WORKDIR /app

RUN adduser --uid 10001 --disabled-password --gecos '' --no-create-home app

RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install libpq-dev && \
    apt-get -y install libffi-dev && \
    apt-get -y install python-dev && \
    apt-get -y install build-essential

# Install virtualenv
RUN pip install virtualenv
RUN virtualenv /venv

# Set permissions for virtualenv
RUN chown app:app -R /venv

# Set User and user permissions
RUN chown app:app -R .
USER app

WORKDIR /app
COPY . /app

# Using /bin/bash as the entrypoint works around some volume mount issues on Windows
# where volume-mounted files do not have execute bits set.
# https://github.com/docker/compose/issues/2301#issuecomment-154450785 has additional background.
ENTRYPOINT ["/bin/bash", "/app/bin/run"]

FROM base AS devapp
RUN echo "Installing dev dependencies"

COPY requirements ./requirements/
RUN pip install --require-hashes --no-cache-dir -r requirements/all.txt
RUN DEBUG=False SECRET_KEY=foo ./manage.py collectstatic --noinput -c

FROM base AS release
RUN echo "Installing prod dependencies"

COPY requirements/build.txt ./requirements/
RUN pip install --require-hashes --no-cache-dir -r requirements/build.txt
RUN DEBUG=False SECRET_KEY=foo ./manage.py collectstatic --noinput -c

