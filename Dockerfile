FROM python:3.7-alpine

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

RUN pip install pipenv

WORKDIR /app

# install python deps globally so we can take advantage of docker caching
COPY Pipfile Pipfile.lock /app/
RUN pipenv install --system --deploy

COPY . /app
RUN chown app:app -R .
USER app

RUN DEBUG=False SECRET_KEY=foo ALLOWED_HOSTS=localhost, PRESTO_URL=foo DATABASE_URL=sqlite:// ./manage.py collectstatic --noinput -c

# Using /bin/bash as the entrypoint works around some volume mount issues on Windows
# where volume-mounted files do not have execute bits set.
# https://github.com/docker/compose/issues/2301#issuecomment-154450785 has additional background.
ENTRYPOINT ["/bin/bash", "/app/bin/run"]

CMD ["dev"]
