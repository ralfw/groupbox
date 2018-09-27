FROM alpine:3.6

ADD groupbox-backend /go/bin/groupbox-backend

EXPOSE 80

RUN apk add --no-cache ca-certificates

CMD /go/bin/groupbox-backend