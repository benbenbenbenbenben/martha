public class MethodDef
{
    public string __TYPE__ => this.GetType().Name;
    public Token name;
    public Attribute[] attributes;
    public Token[] accessors;
    public ArgumentDef[] arguments;
    public Statement[] body;
    public ReturnDef @return;
}