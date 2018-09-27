public class Apply : Op {
    public string __TYPE__ => this.GetType().Name;
    public Op apply;
    public Op to;
}