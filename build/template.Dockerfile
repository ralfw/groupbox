FROM alpine:3.6
ADD groupbox /go/bin/groupbox
EXPOSE 80
CMD ["/go/bin/groupbox", "--port=80", "--mongodb-url=MONGODB_URL"]