# Container image that runs your code
FROM python:3.8-slim-buster

# Copies your code file from your action repository to the filesystem path `/` of the container
ADD . /app
WORKDIR /app

RUN pip install --target/app requests


# Code file to execute when the docker container starts up (`entrypoint.sh`)
FROM gcr.io/distroless/python3-debian10
COPY --from=builder /app /app
ENV PYTHONPATH /app
CMD ["/app/main.py"]
