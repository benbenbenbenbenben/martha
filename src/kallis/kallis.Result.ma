import kallis

type: Result
with:
    bool: success = false
    int: startloc = 0
    int: endloc = 0
    string: value = ""
    Result[]: children = []
    object: yielded
static Result fault(Input:input):
    return new Result {
        startloc = input.location
        endloc = input.location
    }
static Result pass(Input:input):
    return fault {
        success = true
    }
static Result composite(...Result[]:results):
    return new Result {
        success = results.map(r => r.success).reduce((p, c) => p && c)
        children = results
        startloc = results[0].startloc
        endloc = results[-1].endloc
        yielded = results.map(r => r.yielded).filter(y => y != undefined) when .length > 0
    }
