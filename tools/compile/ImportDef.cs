using System;

public class ImportDef {
    
    public string __TYPE__ => this.GetType().Name;

    internal void Visit(Compilation compilation)
    {
        throw new NotImplementedException();
    }
}