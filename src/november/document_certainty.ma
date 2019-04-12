type DocumentSend is digest:
    Address[]: senders
    Address[]: recipients
    void: void(witnessed Address: from{in senders}) -> voided: pass
    state new:
        void: create(digest: reference) -> ready:
            this = reference
    state ready:
        void: send(witnessed Address[]: from{.len > 0}, Address[]: to) -> sent:
            senders = from
            recipients = to
    state sent:
        void: accept(witnessed Address[]: recipient{in recipients}) -> sent, accepted: pass
        void: reject(witnessed Address[]: recipient{in recipients}) -> sent, rejected: pass
    state accepted:
    state rejected:
    state voided: