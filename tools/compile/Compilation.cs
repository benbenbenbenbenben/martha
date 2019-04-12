using System;
using System.Collections.Generic;
using System.Linq;
using Mono.Cecil;
using Mono.Cecil.Cil;
using Mono.Cecil.Rocks;

internal class Compilation
{
    private AssemblyDefinition asm;
    private ModuleDefinition mod;
    public ModuleDefinition Module { get { return mod; } }

    public Compilation()
    {        
        asm = Mono.Cecil.AssemblyDefinition.CreateAssembly(new AssemblyNameDefinition("test", new System.Version(1,1)), "mod", ModuleKind.Dll);
        
        // TODO: review
        CustomAttribute ca = new CustomAttribute (
            asm.MainModule.ImportReference (typeof (System.Runtime.Versioning.TargetFrameworkAttribute).GetConstructor (new Type [] {typeof (string)})));
        ca.ConstructorArguments.Add(new CustomAttributeArgument(asm.Modules.First().TypeSystem.String, ".NETCoreApp,Version=v2.1"));

        asm.CustomAttributes.Add (ca);
        //

        mod = asm.Modules.First();
        /*
        var t1 = new TypeDefinition("default", "Type1", TypeAttributes.Public);
        var m1 = new MethodDefinition("test", MethodAttributes.Public | MethodAttributes.Static, mod.TypeSystem.String);
        m1.Body.GetILProcessor().Emit(OpCodes.Ldstr, "hello");
        m1.Body.GetILProcessor().Emit(OpCodes.Ret);
        t1.Methods.Add(m1);
        mod.Types.Add(t1);
        asm.Write("foo.dll");
        */
    }

    internal void AddType(TypeDefinition type)
    {
        mod.Types.Add(type);
    }

    internal TypeReference GetTypeReference(TypeRef basetype)
    {
        // flags
        bool isarray = false;
        bool isdictionary = false;
        List<TypeReference> dictionarykeys = null;
        //

        if (basetype.indexer.Length > 0) {
            if (basetype.indexer[0].nameref.Length == 0) {
                isarray = true;
            } else {
                isdictionary = true;
                dictionarykeys = new List<TypeReference>();
                foreach (var keytype in basetype.indexer) {
                    var keytyperef = GetTypeReference(keytype);
                    dictionarykeys.Add(keytyperef);
                }
            }
        }
        var typename = basetype.nameref.Last().name.value;
        TypeReference outref = new TypeReference("default", typename, mod, mod);
        
        switch(typename) {
            // TODO: lowercase
            //case "Address":
            //outref = new ArrayType(mod.TypeSystem.Byte);
            //break;
            case "string":
            outref = mod.TypeSystem.String;
            break;
            case "boolean":
            case "bool":
            outref = mod.TypeSystem.Boolean;
            break;
            case "uint32":
            case "uint":
            outref = mod.TypeSystem.UInt32;
            break;
            case "number":
            case "timestamp":
           // outref = mod.TypeSystem.UInt64;
            outref = mod.ImportReference(typeof(System.Numerics.BigInteger));
            break;
        }
        /*
        var types = mod.GetTypeReferences();
        var f = types.FirstOrDefault(t => t.Name == basetype.nameref.Last().name.value && t.Namespace == "default");
        if (f == null) {

        }
        return f;
        */
        // TODO: test dict/array vs array/dict
        if (isarray) {
            outref = new ArrayType(outref);
        }
        if (isdictionary) {
            
            var tupletype = dictionarykeys.Count == 1 
                ? dictionarykeys.First()
                : mod
                .ImportReference(typeof(Tuple<>))
                .MakeGenericInstanceType(
                    dictionarykeys.ToArray()
            );
            var dicttype = mod
                .ImportReference(typeof(Dictionary<,>))
                .MakeGenericInstanceType(
                    tupletype, outref
                );
            outref = dicttype;
        }
        return outref;
    }

    internal void Save(string filename)
    {
        asm.Write(filename);
    }
}