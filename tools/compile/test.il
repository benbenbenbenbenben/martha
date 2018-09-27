
//  Microsoft (R) .NET Framework IL Disassembler.  Version 4.6.1055.0
//  Copyright (c) Microsoft Corporation.  All rights reserved.



// Metadata version: v4.0.30319
.assembly extern System.Runtime
{
  .publickeytoken = (B0 3F 5F 7F 11 D5 0A 3A )                         // .?_....:
  .ver 4:2:0:0
}
.assembly extern System.Reflection.Emit
{
  .publickeytoken = (B0 3F 5F 7F 11 D5 0A 3A )                         // .?_....:
  .ver 4:1:0:0
}
.assembly extern Newtonsoft.Json
{
  .publickeytoken = (30 AD 4F E6 B2 A6 AE ED )                         // 0.O.....
  .ver 11:0:0:0
}
.assembly extern System.Diagnostics.Debug
{
  .publickeytoken = (B0 3F 5F 7F 11 D5 0A 3A )                         // .?_....:
  .ver 4:1:0:0
}
.assembly extern System.IO.FileSystem
{
  .publickeytoken = (B0 3F 5F 7F 11 D5 0A 3A )                         // .?_....:
  .ver 4:1:0:0
}
.assembly compile
{
  .custom instance void [System.Runtime]System.Runtime.CompilerServices.CompilationRelaxationsAttribute::.ctor(int32) = ( 01 00 08 00 00 00 00 00 ) 
  .custom instance void [System.Runtime]System.Runtime.CompilerServices.RuntimeCompatibilityAttribute::.ctor() = ( 01 00 01 00 54 02 16 57 72 61 70 4E 6F 6E 45 78   // ....T..WrapNonEx
                                                                                                                   63 65 70 74 69 6F 6E 54 68 72 6F 77 73 01 )       // ceptionThrows.

  // --- The following custom attribute is added automatically, do not uncomment -------
  //  .custom instance void [System.Runtime]System.Diagnostics.DebuggableAttribute::.ctor(valuetype [System.Runtime]System.Diagnostics.DebuggableAttribute/DebuggingModes) = ( 01 00 07 01 00 00 00 00 ) 

  .custom instance void [System.Runtime]System.Runtime.Versioning.TargetFrameworkAttribute::.ctor(string) = ( 01 00 18 2E 4E 45 54 43 6F 72 65 41 70 70 2C 56   // ....NETCoreApp,V
                                                                                                              65 72 73 69 6F 6E 3D 76 32 2E 30 01 00 54 0E 14   // ersion=v2.0..T..
                                                                                                              46 72 61 6D 65 77 6F 72 6B 44 69 73 70 6C 61 79   // FrameworkDisplay
                                                                                                              4E 61 6D 65 00 )                                  // Name.
  .custom instance void [System.Runtime]System.Reflection.AssemblyCompanyAttribute::.ctor(string) = ( 01 00 07 63 6F 6D 70 69 6C 65 00 00 )             // ...compile..
  .custom instance void [System.Runtime]System.Reflection.AssemblyConfigurationAttribute::.ctor(string) = ( 01 00 05 44 65 62 75 67 00 00 )                   // ...Debug..
  .custom instance void [System.Runtime]System.Reflection.AssemblyFileVersionAttribute::.ctor(string) = ( 01 00 07 31 2E 30 2E 30 2E 30 00 00 )             // ...1.0.0.0..
  .custom instance void [System.Runtime]System.Reflection.AssemblyInformationalVersionAttribute::.ctor(string) = ( 01 00 05 31 2E 30 2E 30 00 00 )                   // ...1.0.0..
  .custom instance void [System.Runtime]System.Reflection.AssemblyProductAttribute::.ctor(string) = ( 01 00 07 63 6F 6D 70 69 6C 65 00 00 )             // ...compile..
  .custom instance void [System.Runtime]System.Reflection.AssemblyTitleAttribute::.ctor(string) = ( 01 00 07 63 6F 6D 70 69 6C 65 00 00 )             // ...compile..
  .hash algorithm 0x00008004
  .ver 1:0:0:0
}
.module compile.dll
// MVID: {2B8155B2-CB12-4946-B950-219AF1F3E172}
.imagebase 0x00400000
.file alignment 0x00000200
.stackreserve 0x00100000
.subsystem 0x0003       // WINDOWS_CUI
.corflags 0x00000001    //  ILONLY
// Image base: 0x0AC10000


// =============== CLASS MEMBERS DECLARATION ===================

.class public auto ansi beforefieldinit Apply
       extends Op
{
  .field public class Op apply
  .field public class Op 'to'
  .method public hidebysig specialname instance string 
          get___TYPE__() cil managed
  {
    // Code size       12 (0xc)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_0006:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_000b:  ret
  } // end of method Apply::get___TYPE__

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Op::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Apply::.ctor

  .property instance string __TYPE__()
  {
    .get instance string Apply::get___TYPE__()
  } // end of property Apply::__TYPE__
} // end of class Apply

.class public auto ansi beforefieldinit ArgumentDef
       extends [System.Runtime]System.Object
{
  .field public class Token name
  .field public class TypeRef[] 'type'
  .field public class Statement[] spec
  .method public hidebysig specialname instance string 
          get___TYPE__() cil managed
  {
    // Code size       12 (0xc)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_0006:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_000b:  ret
  } // end of method ArgumentDef::get___TYPE__

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method ArgumentDef::.ctor

  .property instance string __TYPE__()
  {
    .get instance string ArgumentDef::get___TYPE__()
  } // end of property ArgumentDef::__TYPE__
} // end of class ArgumentDef

.class public auto ansi beforefieldinit Attribute
       extends [System.Runtime]System.Object
{
  .field public object[] targets
  .field public class Statement[] body
  .method public hidebysig specialname instance string 
          get___TYPE__() cil managed
  {
    // Code size       12 (0xc)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_0006:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_000b:  ret
  } // end of method Attribute::get___TYPE__

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Attribute::.ctor

  .property instance string __TYPE__()
  {
    .get instance string Attribute::get___TYPE__()
  } // end of property Attribute::__TYPE__
} // end of class Attribute

.class public auto ansi beforefieldinit Binary
       extends Op
{
  .field public class Op left
  .field public class Op right
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Op::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Binary::.ctor

} // end of class Binary

.class public auto ansi beforefieldinit Dot
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Dot::.ctor

} // end of class Dot

.class public auto ansi beforefieldinit Mult
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Mult::.ctor

} // end of class Mult

.class public auto ansi beforefieldinit Power
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Power::.ctor

} // end of class Power

.class public auto ansi beforefieldinit Div
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Div::.ctor

} // end of class Div

.class public auto ansi beforefieldinit Mod
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Mod::.ctor

} // end of class Mod

.class public auto ansi beforefieldinit Plus
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Plus::.ctor

} // end of class Plus

.class public auto ansi beforefieldinit Minus
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Minus::.ctor

} // end of class Minus

.class public auto ansi beforefieldinit ShiftLeft
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method ShiftLeft::.ctor

} // end of class ShiftLeft

.class public auto ansi beforefieldinit ShiftRight
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method ShiftRight::.ctor

} // end of class ShiftRight

.class public auto ansi beforefieldinit Lt
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Lt::.ctor

} // end of class Lt

.class public auto ansi beforefieldinit Lte
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Lte::.ctor

} // end of class Lte

.class public auto ansi beforefieldinit Gt
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Gt::.ctor

} // end of class Gt

.class public auto ansi beforefieldinit Gte
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Gte::.ctor

} // end of class Gte

.class public auto ansi beforefieldinit EqEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method EqEq::.ctor

} // end of class EqEq

.class public auto ansi beforefieldinit NotEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method NotEq::.ctor

} // end of class NotEq

.class public auto ansi beforefieldinit Amp
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Amp::.ctor

} // end of class Amp

.class public auto ansi beforefieldinit Caret
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Caret::.ctor

} // end of class Caret

.class public auto ansi beforefieldinit Pipe
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Pipe::.ctor

} // end of class Pipe

.class public auto ansi beforefieldinit AmpAmp
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method AmpAmp::.ctor

} // end of class AmpAmp

.class public auto ansi beforefieldinit PipePipe
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method PipePipe::.ctor

} // end of class PipePipe

.class public auto ansi beforefieldinit Assignment
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Assignment::.ctor

} // end of class Assignment

.class public auto ansi beforefieldinit PlusEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method PlusEq::.ctor

} // end of class PlusEq

.class public auto ansi beforefieldinit MinusEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method MinusEq::.ctor

} // end of class MinusEq

.class public auto ansi beforefieldinit MultEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method MultEq::.ctor

} // end of class MultEq

.class public auto ansi beforefieldinit DivEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method DivEq::.ctor

} // end of class DivEq

.class public auto ansi beforefieldinit ModEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method ModEq::.ctor

} // end of class ModEq

.class public auto ansi beforefieldinit ShREq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method ShREq::.ctor

} // end of class ShREq

.class public auto ansi beforefieldinit ShLEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method ShLEq::.ctor

} // end of class ShLEq

.class public auto ansi beforefieldinit AmpEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method AmpEq::.ctor

} // end of class AmpEq

.class public auto ansi beforefieldinit CaretEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method CaretEq::.ctor

} // end of class CaretEq

.class public auto ansi beforefieldinit PipeEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method PipeEq::.ctor

} // end of class PipeEq

.class public auto ansi beforefieldinit PowerEq
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method PowerEq::.ctor

} // end of class PowerEq

.class public auto ansi beforefieldinit Range
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Range::.ctor

} // end of class Range

.class public auto ansi beforefieldinit ColonBin
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method ColonBin::.ctor

} // end of class ColonBin

.class public auto ansi beforefieldinit QuesBin
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method QuesBin::.ctor

} // end of class QuesBin

.class public auto ansi beforefieldinit ExcBin
       extends Binary
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Binary::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method ExcBin::.ctor

} // end of class ExcBin

.class public auto ansi beforefieldinit Bracket
       extends Op
{
  .field public class Op[] statements
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Op::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Bracket::.ctor

} // end of class Bracket

.class public auto ansi beforefieldinit BracketArray
       extends Bracket
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Bracket::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method BracketArray::.ctor

} // end of class BracketArray

.class public auto ansi beforefieldinit BracketCurly
       extends Bracket
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Bracket::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method BracketCurly::.ctor

} // end of class BracketCurly

.class public auto ansi beforefieldinit BracketParen
       extends Bracket
{
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Bracket::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method BracketParen::.ctor

} // end of class BracketParen

.class private auto ansi beforefieldinit Compilation
       extends [System.Runtime]System.Object
{
  .field private class [System.Reflection.Emit]System.Reflection.Emit.AssemblyBuilder 'assembly'
  .field private class [System.Reflection.Emit]System.Reflection.Emit.ModuleBuilder module
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       54 (0x36)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  nop
    IL_0008:  ldarg.0
    IL_0009:  ldstr      "test"
    IL_000e:  newobj     instance void [System.Runtime]System.Reflection.AssemblyName::.ctor(string)
    IL_0013:  ldc.i4.s   9
    IL_0015:  call       class [System.Reflection.Emit]System.Reflection.Emit.AssemblyBuilder [System.Reflection.Emit]System.Reflection.Emit.AssemblyBuilder::DefineDynamicAssembly(class [System.Runtime]System.Reflection.AssemblyName,
                                                                                                                                                                                    valuetype [System.Reflection.Emit]System.Reflection.Emit.AssemblyBuilderAccess)
    IL_001a:  stfld      class [System.Reflection.Emit]System.Reflection.Emit.AssemblyBuilder Compilation::'assembly'
    IL_001f:  ldarg.0
    IL_0020:  ldarg.0
    IL_0021:  ldfld      class [System.Reflection.Emit]System.Reflection.Emit.AssemblyBuilder Compilation::'assembly'
    IL_0026:  ldstr      "entrymodule"
    IL_002b:  callvirt   instance class [System.Reflection.Emit]System.Reflection.Emit.ModuleBuilder [System.Reflection.Emit]System.Reflection.Emit.AssemblyBuilder::DefineDynamicModule(string)
    IL_0030:  stfld      class [System.Reflection.Emit]System.Reflection.Emit.ModuleBuilder Compilation::module
    IL_0035:  ret
  } // end of method Compilation::.ctor

} // end of class Compilation

.class public auto ansi beforefieldinit IfExp
       extends Op
{
  .field public class Statement expression
  .field public class Statement[] body
  .field public class Statement[] altbody
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Op::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method IfExp::.ctor

} // end of class IfExp

.class public auto ansi beforefieldinit ImportDef
       extends [System.Runtime]System.Object
{
  .method public hidebysig specialname instance string 
          get___TYPE__() cil managed
  {
    // Code size       12 (0xc)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_0006:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_000b:  ret
  } // end of method ImportDef::get___TYPE__

  .method assembly hidebysig instance void 
          Visit(class Compilation compilation) cil managed
  {
    // Code size       7 (0x7)
    .maxstack  8
    IL_0000:  nop
    IL_0001:  newobj     instance void [System.Runtime]System.NotImplementedException::.ctor()
    IL_0006:  throw
  } // end of method ImportDef::Visit

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method ImportDef::.ctor

  .property instance string __TYPE__()
  {
    .get instance string ImportDef::get___TYPE__()
  } // end of property ImportDef::__TYPE__
} // end of class ImportDef

.class public auto ansi beforefieldinit Literal
       extends Op
{
  .field public string 'type'
  .field public class Token 'value'
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Op::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Literal::.ctor

} // end of class Literal

.class public auto ansi beforefieldinit MacroDef
       extends [System.Runtime]System.Object
{
  .method public hidebysig specialname instance string 
          get___TYPE__() cil managed
  {
    // Code size       12 (0xc)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_0006:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_000b:  ret
  } // end of method MacroDef::get___TYPE__

  .method assembly hidebysig instance void 
          Visit(class Compilation compilation) cil managed
  {
    // Code size       7 (0x7)
    .maxstack  8
    IL_0000:  nop
    IL_0001:  newobj     instance void [System.Runtime]System.NotImplementedException::.ctor()
    IL_0006:  throw
  } // end of method MacroDef::Visit

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method MacroDef::.ctor

  .property instance string __TYPE__()
  {
    .get instance string MacroDef::get___TYPE__()
  } // end of property MacroDef::__TYPE__
} // end of class MacroDef

.class public auto ansi beforefieldinit MemberDef
       extends [System.Runtime]System.Object
{
  .field public class TypeRef 'type'
  .field public class Token name
  .field public class Statement[] getter
  .field public class Statement[] setter
  .method public hidebysig specialname instance string 
          get___TYPE__() cil managed
  {
    // Code size       12 (0xc)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_0006:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_000b:  ret
  } // end of method MemberDef::get___TYPE__

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method MemberDef::.ctor

  .property instance string __TYPE__()
  {
    .get instance string MemberDef::get___TYPE__()
  } // end of property MemberDef::__TYPE__
} // end of class MemberDef

.class public auto ansi beforefieldinit MethodDef
       extends [System.Runtime]System.Object
{
  .field public class Token name
  .field public class Attribute[] attributes
  .field public class Token[] accessors
  .field public class ArgumentDef[] arguments
  .field public class Statement[] body
  .field public class ReturnDef return
  .method public hidebysig specialname instance string 
          get___TYPE__() cil managed
  {
    // Code size       12 (0xc)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_0006:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_000b:  ret
  } // end of method MethodDef::get___TYPE__

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method MethodDef::.ctor

  .property instance string __TYPE__()
  {
    .get instance string MethodDef::get___TYPE__()
  } // end of property MethodDef::__TYPE__
} // end of class MethodDef

.class public auto ansi beforefieldinit Op
       extends [System.Runtime]System.Object
{
  .custom instance void [Newtonsoft.Json]Newtonsoft.Json.JsonConverterAttribute::.ctor(class [System.Runtime]System.Type) = ( 01 00 12 53 74 61 74 65 6D 65 6E 74 43 6F 6E 76   // ...StatementConv
                                                                                                                              65 72 74 6F 72 00 00 )                            // ertor..
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Op::.ctor

} // end of class Op

.class public auto ansi beforefieldinit ProgramDef
       extends [System.Runtime]System.Object
{
  .field public string identity
  .field public class ImportDef[] imports
  .field public class MacroDef[] macros
  .field public class TypeDef[] types
  .method assembly hidebysig instance void 
          Visit(class Compilation program) cil managed
  {
    // Code size       127 (0x7f)
    .maxstack  2
    .locals init (class ImportDef[] V_0,
             int32 V_1,
             class ImportDef V_2,
             class MacroDef[] V_3,
             int32 V_4,
             class MacroDef V_5,
             class TypeDef[] V_6,
             int32 V_7,
             class TypeDef V_8)
    IL_0000:  nop
    IL_0001:  nop
    IL_0002:  ldarg.0
    IL_0003:  ldfld      class ImportDef[] ProgramDef::imports
    IL_0008:  stloc.0
    IL_0009:  ldc.i4.0
    IL_000a:  stloc.1
    IL_000b:  br.s       IL_001f

    IL_000d:  ldloc.0
    IL_000e:  ldloc.1
    IL_000f:  ldelem.ref
    IL_0010:  stloc.2
    IL_0011:  nop
    IL_0012:  ldloc.2
    IL_0013:  ldarg.1
    IL_0014:  callvirt   instance void ImportDef::Visit(class Compilation)
    IL_0019:  nop
    IL_001a:  nop
    IL_001b:  ldloc.1
    IL_001c:  ldc.i4.1
    IL_001d:  add
    IL_001e:  stloc.1
    IL_001f:  ldloc.1
    IL_0020:  ldloc.0
    IL_0021:  ldlen
    IL_0022:  conv.i4
    IL_0023:  blt.s      IL_000d

    IL_0025:  nop
    IL_0026:  ldarg.0
    IL_0027:  ldfld      class MacroDef[] ProgramDef::macros
    IL_002c:  stloc.3
    IL_002d:  ldc.i4.0
    IL_002e:  stloc.s    V_4
    IL_0030:  br.s       IL_0049

    IL_0032:  ldloc.3
    IL_0033:  ldloc.s    V_4
    IL_0035:  ldelem.ref
    IL_0036:  stloc.s    V_5
    IL_0038:  nop
    IL_0039:  ldloc.s    V_5
    IL_003b:  ldarg.1
    IL_003c:  callvirt   instance void MacroDef::Visit(class Compilation)
    IL_0041:  nop
    IL_0042:  nop
    IL_0043:  ldloc.s    V_4
    IL_0045:  ldc.i4.1
    IL_0046:  add
    IL_0047:  stloc.s    V_4
    IL_0049:  ldloc.s    V_4
    IL_004b:  ldloc.3
    IL_004c:  ldlen
    IL_004d:  conv.i4
    IL_004e:  blt.s      IL_0032

    IL_0050:  nop
    IL_0051:  ldarg.0
    IL_0052:  ldfld      class TypeDef[] ProgramDef::types
    IL_0057:  stloc.s    V_6
    IL_0059:  ldc.i4.0
    IL_005a:  stloc.s    V_7
    IL_005c:  br.s       IL_0076

    IL_005e:  ldloc.s    V_6
    IL_0060:  ldloc.s    V_7
    IL_0062:  ldelem.ref
    IL_0063:  stloc.s    V_8
    IL_0065:  nop
    IL_0066:  ldloc.s    V_8
    IL_0068:  ldarg.1
    IL_0069:  callvirt   instance void TypeDef::Visit(class Compilation)
    IL_006e:  nop
    IL_006f:  nop
    IL_0070:  ldloc.s    V_7
    IL_0072:  ldc.i4.1
    IL_0073:  add
    IL_0074:  stloc.s    V_7
    IL_0076:  ldloc.s    V_7
    IL_0078:  ldloc.s    V_6
    IL_007a:  ldlen
    IL_007b:  conv.i4
    IL_007c:  blt.s      IL_005e

    IL_007e:  ret
  } // end of method ProgramDef::Visit

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method ProgramDef::.ctor

} // end of class ProgramDef

.class public auto ansi beforefieldinit Reference
       extends Op
{
  .field public class Token name
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void Op::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Reference::.ctor

} // end of class Reference

.class public auto ansi beforefieldinit ReturnDef
       extends [System.Runtime]System.Object
{
  .field public class TypeRef 'type'
  .field public class Statement[] spec
  .method public hidebysig specialname instance string 
          get___TYPE__() cil managed
  {
    // Code size       12 (0xc)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_0006:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_000b:  ret
  } // end of method ReturnDef::get___TYPE__

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method ReturnDef::.ctor

  .property instance string __TYPE__()
  {
    .get instance string ReturnDef::get___TYPE__()
  } // end of property ReturnDef::__TYPE__
} // end of class ReturnDef

.class public auto ansi beforefieldinit Statement
       extends [System.Runtime]System.Object
{
  .field public class Op[] statement
  .method public hidebysig specialname instance string 
          get___TYPE__() cil managed
  {
    // Code size       12 (0xc)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_0006:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_000b:  ret
  } // end of method Statement::get___TYPE__

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Statement::.ctor

  .property instance string __TYPE__()
  {
    .get instance string Statement::get___TYPE__()
  } // end of property Statement::__TYPE__
} // end of class Statement

.class public auto ansi beforefieldinit StatementConvertor
       extends [Newtonsoft.Json]Newtonsoft.Json.JsonConverter
{
  .field private bool '<CannotWrite>k__BackingField'
  .custom instance void [System.Runtime]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
  .custom instance void [System.Diagnostics.Debug]System.Diagnostics.DebuggerBrowsableAttribute::.ctor(valuetype [System.Diagnostics.Debug]System.Diagnostics.DebuggerBrowsableState) = ( 01 00 00 00 00 00 00 00 ) 
  .method public hidebysig virtual instance bool 
          CanConvert(class [System.Runtime]System.Type objectType) cil managed
  {
    // Code size       7 (0x7)
    .maxstack  8
    IL_0000:  nop
    IL_0001:  newobj     instance void [System.Runtime]System.NotImplementedException::.ctor()
    IL_0006:  throw
  } // end of method StatementConvertor::CanConvert

  .method public hidebysig virtual instance object 
          ReadJson(class [Newtonsoft.Json]Newtonsoft.Json.JsonReader reader,
                   class [System.Runtime]System.Type objectType,
                   object existingValue,
                   class [Newtonsoft.Json]Newtonsoft.Json.JsonSerializer serializer) cil managed
  {
    // Code size       62 (0x3e)
    .maxstack  3
    .locals init (class [Newtonsoft.Json]Newtonsoft.Json.Linq.JObject V_0,
             string V_1,
             class [System.Runtime]System.Type V_2,
             object V_3,
             object V_4)
    IL_0000:  nop
    IL_0001:  ldarg.1
    IL_0002:  call       class [Newtonsoft.Json]Newtonsoft.Json.Linq.JObject [Newtonsoft.Json]Newtonsoft.Json.Linq.JObject::Load(class [Newtonsoft.Json]Newtonsoft.Json.JsonReader)
    IL_0007:  stloc.0
    IL_0008:  ldloc.0
    IL_0009:  ldstr      "__TYPE__"
    IL_000e:  callvirt   instance class [Newtonsoft.Json]Newtonsoft.Json.Linq.JToken [Newtonsoft.Json]Newtonsoft.Json.Linq.JObject::GetValue(string)
    IL_0013:  callvirt   instance string [System.Runtime]System.Object::ToString()
    IL_0018:  stloc.1
    IL_0019:  ldloc.1
    IL_001a:  call       class [System.Runtime]System.Type [System.Runtime]System.Type::GetType(string)
    IL_001f:  stloc.2
    IL_0020:  ldloc.2
    IL_0021:  call       object [System.Runtime]System.Activator::CreateInstance(class [System.Runtime]System.Type)
    IL_0026:  stloc.3
    IL_0027:  ldarg.s    serializer
    IL_0029:  ldloc.0
    IL_002a:  callvirt   instance class [Newtonsoft.Json]Newtonsoft.Json.JsonReader [Newtonsoft.Json]Newtonsoft.Json.Linq.JToken::CreateReader()
    IL_002f:  ldloc.3
    IL_0030:  callvirt   instance void [Newtonsoft.Json]Newtonsoft.Json.JsonSerializer::Populate(class [Newtonsoft.Json]Newtonsoft.Json.JsonReader,
                                                                                                 object)
    IL_0035:  nop
    IL_0036:  ldloc.3
    IL_0037:  stloc.s    V_4
    IL_0039:  br.s       IL_003b

    IL_003b:  ldloc.s    V_4
    IL_003d:  ret
  } // end of method StatementConvertor::ReadJson

  .method private hidebysig specialname instance bool 
          get_CannotWrite() cil managed
  {
    .custom instance void [System.Runtime]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
    // Code size       7 (0x7)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  ldfld      bool StatementConvertor::'<CannotWrite>k__BackingField'
    IL_0006:  ret
  } // end of method StatementConvertor::get_CannotWrite

  .method private hidebysig specialname instance void 
          set_CannotWrite(bool 'value') cil managed
  {
    .custom instance void [System.Runtime]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  ldarg.1
    IL_0002:  stfld      bool StatementConvertor::'<CannotWrite>k__BackingField'
    IL_0007:  ret
  } // end of method StatementConvertor::set_CannotWrite

  .method public hidebysig specialname virtual 
          instance bool  get_CanWrite() cil managed
  {
    // Code size       15 (0xf)
    .maxstack  2
    .locals init (bool V_0)
    IL_0000:  nop
    IL_0001:  ldarg.0
    IL_0002:  call       instance bool StatementConvertor::get_CannotWrite()
    IL_0007:  ldc.i4.0
    IL_0008:  ceq
    IL_000a:  stloc.0
    IL_000b:  br.s       IL_000d

    IL_000d:  ldloc.0
    IL_000e:  ret
  } // end of method StatementConvertor::get_CanWrite

  .method public hidebysig virtual instance void 
          WriteJson(class [Newtonsoft.Json]Newtonsoft.Json.JsonWriter writer,
                    object 'value',
                    class [Newtonsoft.Json]Newtonsoft.Json.JsonSerializer serializer) cil managed
  {
    // Code size       168 (0xa8)
    .maxstack  5
    .locals init (class [Newtonsoft.Json]Newtonsoft.Json.Linq.JToken V_0,
             valuetype PushValue`1<bool> V_1,
             bool V_2,
             bool V_3)
    IL_0000:  nop
    IL_0001:  ldloca.s   V_1
    IL_0003:  ldc.i4.1
    IL_0004:  ldarg.0
    IL_0005:  ldftn      instance bool StatementConvertor::'<WriteJson>b__8_0'()
    IL_000b:  newobj     instance void class [System.Runtime]System.Func`1<bool>::.ctor(object,
                                                                                        native int)
    IL_0010:  ldarg.0
    IL_0011:  ldftn      instance void StatementConvertor::'<WriteJson>b__8_1'(bool)
    IL_0017:  newobj     instance void class [System.Runtime]System.Action`1<bool>::.ctor(object,
                                                                                          native int)
    IL_001c:  call       instance void valuetype PushValue`1<bool>::.ctor(!0,
                                                                          class [System.Runtime]System.Func`1<!0>,
                                                                          class [System.Runtime]System.Action`1<!0>)
    .try
    {
      IL_0021:  nop
      IL_0022:  ldarg.2
      IL_0023:  ldarg.3
      IL_0024:  call       class [Newtonsoft.Json]Newtonsoft.Json.Linq.JToken [Newtonsoft.Json]Newtonsoft.Json.Linq.JToken::FromObject(object,
                                                                                                                                       class [Newtonsoft.Json]Newtonsoft.Json.JsonSerializer)
      IL_0029:  stloc.0
      IL_002a:  nop
      IL_002b:  leave.s    IL_003c

    }  // end .try
    finally
    {
      IL_002d:  ldloca.s   V_1
      IL_002f:  constrained. valuetype PushValue`1<bool>
      IL_0035:  callvirt   instance void [System.Runtime]System.IDisposable::Dispose()
      IL_003a:  nop
      IL_003b:  endfinally
    }  // end handler
    IL_003c:  ldloc.0
    IL_003d:  callvirt   instance valuetype [Newtonsoft.Json]Newtonsoft.Json.Linq.JTokenType [Newtonsoft.Json]Newtonsoft.Json.Linq.JToken::get_Type()
    IL_0042:  ldc.i4.1
    IL_0043:  ceq
    IL_0045:  ldc.i4.0
    IL_0046:  ceq
    IL_0048:  stloc.2
    IL_0049:  ldloc.2
    IL_004a:  brfalse.s  IL_0062

    IL_004c:  nop
    IL_004d:  ldarg.3
    IL_004e:  ldarg.1
    IL_004f:  ldarg.2
    IL_0050:  ldtoken    [System.Runtime]System.Object
    IL_0055:  call       class [System.Runtime]System.Type [System.Runtime]System.Type::GetTypeFromHandle(valuetype [System.Runtime]System.RuntimeTypeHandle)
    IL_005a:  callvirt   instance void [Newtonsoft.Json]Newtonsoft.Json.JsonSerializer::Serialize(class [Newtonsoft.Json]Newtonsoft.Json.JsonWriter,
                                                                                                  object,
                                                                                                  class [System.Runtime]System.Type)
    IL_005f:  nop
    IL_0060:  br.s       IL_00a7

    IL_0062:  ldloc.0
    IL_0063:  castclass  [Newtonsoft.Json]Newtonsoft.Json.Linq.JObject
    IL_0068:  ldstr      "__TYPE__"
    IL_006d:  callvirt   instance bool [Newtonsoft.Json]Newtonsoft.Json.Linq.JObject::ContainsKey(string)
    IL_0072:  ldc.i4.0
    IL_0073:  ceq
    IL_0075:  stloc.3
    IL_0076:  ldloc.3
    IL_0077:  brfalse.s  IL_009a

    IL_0079:  ldloc.0
    IL_007a:  castclass  [Newtonsoft.Json]Newtonsoft.Json.Linq.JObject
    IL_007f:  ldstr      "__TYPE__"
    IL_0084:  ldarg.2
    IL_0085:  callvirt   instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_008a:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_008f:  newobj     instance void [Newtonsoft.Json]Newtonsoft.Json.Linq.JProperty::.ctor(string,
                                                                                              object)
    IL_0094:  callvirt   instance void [Newtonsoft.Json]Newtonsoft.Json.Linq.JContainer::AddFirst(object)
    IL_0099:  nop
    IL_009a:  ldloc.0
    IL_009b:  ldarg.1
    IL_009c:  call       !!0[] [System.Runtime]System.Array::Empty<class [Newtonsoft.Json]Newtonsoft.Json.JsonConverter>()
    IL_00a1:  callvirt   instance void [Newtonsoft.Json]Newtonsoft.Json.Linq.JToken::WriteTo(class [Newtonsoft.Json]Newtonsoft.Json.JsonWriter,
                                                                                             class [Newtonsoft.Json]Newtonsoft.Json.JsonConverter[])
    IL_00a6:  nop
    IL_00a7:  ret
  } // end of method StatementConvertor::WriteJson

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [Newtonsoft.Json]Newtonsoft.Json.JsonConverter::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method StatementConvertor::.ctor

  .method private hidebysig instance bool 
          '<WriteJson>b__8_0'() cil managed
  {
    .custom instance void [System.Runtime]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
    // Code size       7 (0x7)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance bool StatementConvertor::get_CannotWrite()
    IL_0006:  ret
  } // end of method StatementConvertor::'<WriteJson>b__8_0'

  .method private hidebysig instance void 
          '<WriteJson>b__8_1'(bool canWrite) cil managed
  {
    .custom instance void [System.Runtime]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
    // Code size       9 (0x9)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  ldarg.1
    IL_0002:  call       instance void StatementConvertor::set_CannotWrite(bool)
    IL_0007:  nop
    IL_0008:  ret
  } // end of method StatementConvertor::'<WriteJson>b__8_1'

  .property instance bool CannotWrite()
  {
    .get instance bool StatementConvertor::get_CannotWrite()
    .set instance void StatementConvertor::set_CannotWrite(bool)
  } // end of property StatementConvertor::CannotWrite
  .property instance bool CanWrite()
  {
    .get instance bool StatementConvertor::get_CanWrite()
  } // end of property StatementConvertor::CanWrite
} // end of class StatementConvertor

.class public sequential ansi sealed beforefieldinit PushValue`1<T>
       extends [System.Runtime]System.ValueType
       implements [System.Runtime]System.IDisposable
{
  .field private class [System.Runtime]System.Func`1<!T> getValue
  .field private class [System.Runtime]System.Action`1<!T> setValue
  .field private !T oldValue
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor(!T 'value',
                               class [System.Runtime]System.Func`1<!T> getValue,
                               class [System.Runtime]System.Action`1<!T> setValue) cil managed
  {
    // Code size       56 (0x38)
    .maxstack  2
    .locals init (bool V_0)
    IL_0000:  nop
    IL_0001:  ldarg.2
    IL_0002:  brfalse.s  IL_000a

    IL_0004:  ldarg.3
    IL_0005:  ldnull
    IL_0006:  ceq
    IL_0008:  br.s       IL_000b

    IL_000a:  ldc.i4.1
    IL_000b:  stloc.0
    IL_000c:  ldloc.0
    IL_000d:  brfalse.s  IL_0015

    IL_000f:  newobj     instance void [System.Runtime]System.ArgumentNullException::.ctor()
    IL_0014:  throw

    IL_0015:  ldarg.0
    IL_0016:  ldarg.2
    IL_0017:  stfld      class [System.Runtime]System.Func`1<!0> valuetype PushValue`1<!T>::getValue
    IL_001c:  ldarg.0
    IL_001d:  ldarg.3
    IL_001e:  stfld      class [System.Runtime]System.Action`1<!0> valuetype PushValue`1<!T>::setValue
    IL_0023:  ldarg.0
    IL_0024:  ldarg.2
    IL_0025:  callvirt   instance !0 class [System.Runtime]System.Func`1<!T>::Invoke()
    IL_002a:  stfld      !0 valuetype PushValue`1<!T>::oldValue
    IL_002f:  ldarg.3
    IL_0030:  ldarg.1
    IL_0031:  callvirt   instance void class [System.Runtime]System.Action`1<!T>::Invoke(!0)
    IL_0036:  nop
    IL_0037:  ret
  } // end of method PushValue`1::.ctor

  .method public hidebysig newslot virtual final 
          instance void  Dispose() cil managed
  {
    // Code size       33 (0x21)
    .maxstack  2
    .locals init (bool V_0)
    IL_0000:  nop
    IL_0001:  ldarg.0
    IL_0002:  ldfld      class [System.Runtime]System.Action`1<!0> valuetype PushValue`1<!T>::setValue
    IL_0007:  ldnull
    IL_0008:  cgt.un
    IL_000a:  stloc.0
    IL_000b:  ldloc.0
    IL_000c:  brfalse.s  IL_0020

    IL_000e:  ldarg.0
    IL_000f:  ldfld      class [System.Runtime]System.Action`1<!0> valuetype PushValue`1<!T>::setValue
    IL_0014:  ldarg.0
    IL_0015:  ldfld      !0 valuetype PushValue`1<!T>::oldValue
    IL_001a:  callvirt   instance void class [System.Runtime]System.Action`1<!T>::Invoke(!0)
    IL_001f:  nop
    IL_0020:  ret
  } // end of method PushValue`1::Dispose

} // end of class PushValue`1

.class public auto ansi beforefieldinit Token
       extends [System.Runtime]System.Object
{
  .field public string 'value'
  .field public int32 index
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Token::.ctor

} // end of class Token

.class public auto ansi beforefieldinit TypeDef
       extends [System.Runtime]System.Object
{
  .field public class Token name
  .field public class TypeRef basetype
  .field public class MemberDef[] members
  .field public class MethodDef[] methods
  .method public hidebysig specialname instance string 
          get___TYPE__() cil managed
  {
    // Code size       12 (0xc)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_0006:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_000b:  ret
  } // end of method TypeDef::get___TYPE__

  .method assembly hidebysig instance void 
          Visit(class Compilation compilation) cil managed
  {
    // Code size       2 (0x2)
    .maxstack  8
    IL_0000:  nop
    IL_0001:  ret
  } // end of method TypeDef::Visit

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method TypeDef::.ctor

  .property instance string __TYPE__()
  {
    .get instance string TypeDef::get___TYPE__()
  } // end of property TypeDef::__TYPE__
} // end of class TypeDef

.class public auto ansi beforefieldinit TypeRef
       extends [System.Runtime]System.Object
{
  .field public class Reference[] nameref
  .field public class TypeRef[] indexer
  .field public class TypeRef[] types
  .method public hidebysig specialname instance string 
          get___TYPE__() cil managed
  {
    // Code size       12 (0xc)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance class [System.Runtime]System.Type [System.Runtime]System.Object::GetType()
    IL_0006:  callvirt   instance string [System.Runtime]System.Reflection.MemberInfo::get_Name()
    IL_000b:  ret
  } // end of method TypeRef::get___TYPE__

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method TypeRef::.ctor

  .property instance string __TYPE__()
  {
    .get instance string TypeRef::get___TYPE__()
  } // end of property TypeRef::__TYPE__
} // end of class TypeRef

.class private auto ansi beforefieldinit compile.Program
       extends [System.Runtime]System.Object
{
  .method private hidebysig static void  Main(string[] args) cil managed
  {
    .entrypoint
    // Code size       133 (0x85)
    .maxstack  4
    .locals init (class Compilation V_0,
             string[] V_1,
             string[] V_2,
             int32 V_3,
             string V_4,
             string V_5,
             class ProgramDef V_6,
             string V_7)
    IL_0000:  nop
    IL_0001:  newobj     instance void Compilation::.ctor()
    IL_0006:  stloc.0
    IL_0007:  ldstr      "..\\..\\src\\genesis"
    IL_000c:  ldstr      "*.json"
    IL_0011:  call       string[] [System.IO.FileSystem]System.IO.Directory::GetFiles(string,
                                                                                      string)
    IL_0016:  stloc.1
    IL_0017:  nop
    IL_0018:  ldloc.1
    IL_0019:  stloc.2
    IL_001a:  ldc.i4.0
    IL_001b:  stloc.3
    IL_001c:  br.s       IL_007e

    IL_001e:  ldloc.2
    IL_001f:  ldloc.3
    IL_0020:  ldelem.ref
    IL_0021:  stloc.s    V_4
    IL_0023:  nop
    IL_0024:  ldloc.s    V_4
    IL_0026:  call       string [System.IO.FileSystem]System.IO.File::ReadAllText(string)
    IL_002b:  stloc.s    V_5
    IL_002d:  ldloc.s    V_5
    IL_002f:  call       !!0 [Newtonsoft.Json]Newtonsoft.Json.JsonConvert::DeserializeObject<class ProgramDef>(string)
    IL_0034:  stloc.s    V_6
    IL_0036:  ldloc.s    V_6
    IL_0038:  newobj     instance void [Newtonsoft.Json]Newtonsoft.Json.JsonSerializerSettings::.ctor()
    IL_003d:  dup
    IL_003e:  ldc.i4.2
    IL_003f:  callvirt   instance void [Newtonsoft.Json]Newtonsoft.Json.JsonSerializerSettings::set_ReferenceLoopHandling(valuetype [Newtonsoft.Json]Newtonsoft.Json.ReferenceLoopHandling)
    IL_0044:  nop
    IL_0045:  dup
    IL_0046:  ldc.i4.1
    IL_0047:  callvirt   instance void [Newtonsoft.Json]Newtonsoft.Json.JsonSerializerSettings::set_NullValueHandling(valuetype [Newtonsoft.Json]Newtonsoft.Json.NullValueHandling)
    IL_004c:  nop
    IL_004d:  dup
    IL_004e:  ldc.i4.1
    IL_004f:  callvirt   instance void [Newtonsoft.Json]Newtonsoft.Json.JsonSerializerSettings::set_Formatting(valuetype [Newtonsoft.Json]Newtonsoft.Json.Formatting)
    IL_0054:  nop
    IL_0055:  call       string [Newtonsoft.Json]Newtonsoft.Json.JsonConvert::SerializeObject(object,
                                                                                              class [Newtonsoft.Json]Newtonsoft.Json.JsonSerializerSettings)
    IL_005a:  stloc.s    V_7
    IL_005c:  ldloc.s    V_4
    IL_005e:  ldstr      ".out.json"
    IL_0063:  call       string [System.Runtime]System.String::Concat(string,
                                                                      string)
    IL_0068:  ldloc.s    V_7
    IL_006a:  call       void [System.IO.FileSystem]System.IO.File::WriteAllText(string,
                                                                                 string)
    IL_006f:  nop
    IL_0070:  ldloc.s    V_6
    IL_0072:  ldloc.0
    IL_0073:  callvirt   instance void ProgramDef::Visit(class Compilation)
    IL_0078:  nop
    IL_0079:  nop
    IL_007a:  ldloc.3
    IL_007b:  ldc.i4.1
    IL_007c:  add
    IL_007d:  stloc.3
    IL_007e:  ldloc.3
    IL_007f:  ldloc.2
    IL_0080:  ldlen
    IL_0081:  conv.i4
    IL_0082:  blt.s      IL_001e

    IL_0084:  ret
  } // end of method Program::Main

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // Code size       8 (0x8)
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [System.Runtime]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Program::.ctor

} // end of class compile.Program


// =============================================================

// *********** DISASSEMBLY COMPLETE ***********************
// WARNING: Created Win32 resource file C:\Users\ben\Source\Repos\martha\tools\compile\test.res
