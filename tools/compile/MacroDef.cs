using System;

public class MacroDef
{
    public string __TYPE__ => this.GetType().Name;

    internal void Visit(Compilation compilation)
    {
        throw new NotImplementedException();
    }
}