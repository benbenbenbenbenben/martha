class DocumentSend : IStateMachine<WrappedValue<digest>> {
    private Address[] senders;
    private Address[] recipients;

    private Tuple<string, string>[] __transitions;
    private string __state = "new";
    public void __gotoState(string state)
    {
        foreach (var tuple in __transitions) {
            if (tuple.Left == __state && tuple.Right == state) {
                __state = state;
                break;
            }
        }
        throw new System.Exception("unknown state");
    }
    
    [NextState("voided")]
    public void @void([witnessed, check("in", "senders")] Address from)
    {
    }

    [State("new"), NextState("ready")]
    public void @create(digest reference)
    {        
        base.Value = reference;
        __gotoState("ready");
    }
}