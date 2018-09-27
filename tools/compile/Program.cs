using System;
using System.IO;
using Newtonsoft.Json;

namespace compile
{
    class Program
    {
        static void Main(string[] args)
        {
            var compilation = new Compilation();
            var files = System.IO.Directory.GetFiles(@"..\..\src\genesis", "*.json");
            foreach (var file in files)
            {
                var input = System.IO.File.ReadAllText(file);
                var program = Newtonsoft.Json.JsonConvert.DeserializeObject<ProgramDef>(input);
                var serial = Newtonsoft.Json.JsonConvert.SerializeObject(program, new JsonSerializerSettings()
                    {   
                        
                        ReferenceLoopHandling = ReferenceLoopHandling.Serialize,
                        //PreserveReferencesHandling = PreserveReferencesHandling.Objects,
                        NullValueHandling = NullValueHandling.Ignore,
                        Formatting = Formatting.Indented
                    }
                );
                var dir = Path.GetDirectoryName(file);
                var f = Path.GetFileName(file);
                var o = Path.Combine(dir, "out", f);
                if(!Directory.Exists(Path.Combine(dir, "out")))
                    Directory.CreateDirectory(Path.Combine(dir,"out"));
                File.WriteAllText(o, serial);
                program.Visit(compilation);
            }
            compilation.Save("bar.dll");
        }
    }
}
