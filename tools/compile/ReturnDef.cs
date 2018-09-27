public class ReturnDef
{
    public string __TYPE__ => this.GetType().Name;
    public TypeRef type;
    public Statement[] spec;
}