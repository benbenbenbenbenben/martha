public class Attribute
{
    public string __TYPE__ => this.GetType().Name;
    public object[] targets;
    public Statement[] body;
}