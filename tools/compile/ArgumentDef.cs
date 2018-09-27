public class ArgumentDef
{
    public string __TYPE__ => this.GetType().Name;
    public Token name;
    public TypeRef[] type;
    public Statement[] spec;

}