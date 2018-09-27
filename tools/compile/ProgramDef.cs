using System;
using System.Linq;
using System.Threading.Tasks;

public class ProgramDef {
    public string identity;
    public ImportDef[] imports;
    public MacroDef[] macros;
    public TypeDef[] types;

    internal void Visit(Compilation program)
    {
        foreach (var import in imports)
        {
            import.Visit(program);
        }
        foreach(var macro in macros)
        {
            macro.Visit(program);
        }
        foreach(var type in types)
        {
            type.Visit(program);
        }
    }
}