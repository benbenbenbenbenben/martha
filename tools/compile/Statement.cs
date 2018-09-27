using Newtonsoft.Json;

public class Statement
{
    public string __TYPE__ => this.GetType().Name;
    public Op[] statement;
}