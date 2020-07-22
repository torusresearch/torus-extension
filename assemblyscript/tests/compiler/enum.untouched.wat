(module
 (type $FUNCSIG$i (func (result i32)))
 (type $FUNCSIG$v (func))
 (memory $0 0)
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $enum/Implicit.ZERO i32 (i32.const 0))
 (global $enum/Implicit.ONE i32 (i32.const 1))
 (global $enum/Implicit.TWO i32 (i32.const 2))
 (global $enum/Implicit.THREE i32 (i32.const 3))
 (global $enum/ImplicitConst.ZERO i32 (i32.const 0))
 (global $enum/ImplicitConst.ONE i32 (i32.const 1))
 (global $enum/ImplicitConst.TWO i32 (i32.const 2))
 (global $enum/ImplicitConst.THREE i32 (i32.const 3))
 (global $enum/Explicit.ZERO i32 (i32.const 0))
 (global $enum/Explicit.ONE i32 (i32.const 1))
 (global $enum/Explicit.TWO i32 (i32.const 2))
 (global $enum/Explicit.THREE i32 (i32.const 3))
 (global $enum/ExplicitConst.ZERO i32 (i32.const 0))
 (global $enum/ExplicitConst.ONE i32 (i32.const 1))
 (global $enum/ExplicitConst.TWO i32 (i32.const 2))
 (global $enum/ExplicitConst.THREE i32 (i32.const 3))
 (global $enum/Mixed.ZERO i32 (i32.const 0))
 (global $enum/Mixed.ONE i32 (i32.const 1))
 (global $enum/Mixed.THREE i32 (i32.const 3))
 (global $enum/Mixed.FOUR i32 (i32.const 4))
 (global $enum/MixedConst.ZERO i32 (i32.const 0))
 (global $enum/MixedConst.ONE i32 (i32.const 1))
 (global $enum/MixedConst.THREE i32 (i32.const 3))
 (global $enum/MixedConst.FOUR i32 (i32.const 4))
 (global $enum/NonConstant.ZERO (mut i32) (i32.const 0))
 (global $enum/NonConstant.ONE (mut i32) (i32.const 0))
 (global $enum/SelfReference.ZERO i32 (i32.const 0))
 (global $enum/SelfReference.ONE i32 (i32.const 1))
 (global $enum/SelfReferenceConst.ZERO i32 (i32.const 0))
 (global $enum/SelfReferenceConst.ONE i32 (i32.const 1))
 (global $enum/enumType (mut i32) (i32.const 0))
 (global $~lib/memory/HEAP_BASE i32 (i32.const 8))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "Implicit.ZERO" (global $enum/Implicit.ZERO))
 (export "Implicit.ONE" (global $enum/Implicit.ONE))
 (export "Implicit.TWO" (global $enum/Implicit.TWO))
 (export "Implicit.THREE" (global $enum/Implicit.THREE))
 (export "ImplicitConst.ZERO" (global $enum/ImplicitConst.ZERO))
 (export "ImplicitConst.ONE" (global $enum/ImplicitConst.ONE))
 (export "ImplicitConst.TWO" (global $enum/ImplicitConst.TWO))
 (export "ImplicitConst.THREE" (global $enum/ImplicitConst.THREE))
 (export "Explicit.ZERO" (global $enum/Explicit.ZERO))
 (export "Explicit.ONE" (global $enum/Explicit.ONE))
 (export "Explicit.TWO" (global $enum/Explicit.TWO))
 (export "Explicit.THREE" (global $enum/Explicit.THREE))
 (export "ExplicitConst.ZERO" (global $enum/ExplicitConst.ZERO))
 (export "ExplicitConst.ONE" (global $enum/ExplicitConst.ONE))
 (export "ExplicitConst.TWO" (global $enum/ExplicitConst.TWO))
 (export "ExplicitConst.THREE" (global $enum/ExplicitConst.THREE))
 (export "Mixed.ZERO" (global $enum/Mixed.ZERO))
 (export "Mixed.ONE" (global $enum/Mixed.ONE))
 (export "Mixed.THREE" (global $enum/Mixed.THREE))
 (export "Mixed.FOUR" (global $enum/Mixed.FOUR))
 (export "MixedConst.ZERO" (global $enum/MixedConst.ZERO))
 (export "MixedConst.ONE" (global $enum/MixedConst.ONE))
 (export "MixedConst.THREE" (global $enum/MixedConst.THREE))
 (export "MixedConst.FOUR" (global $enum/MixedConst.FOUR))
 (export "SelfReference.ZERO" (global $enum/SelfReference.ZERO))
 (export "SelfReference.ONE" (global $enum/SelfReference.ONE))
 (export "SelfReferenceConst.ZERO" (global $enum/SelfReferenceConst.ZERO))
 (export "SelfReferenceConst.ONE" (global $enum/SelfReferenceConst.ONE))
 (start $start)
 (func $enum/getZero (; 0 ;) (type $FUNCSIG$i) (result i32)
  i32.const 0
 )
 (func $start:enum (; 1 ;) (type $FUNCSIG$v)
  call $enum/getZero
  global.set $enum/NonConstant.ZERO
  call $enum/getZero
  i32.const 1
  i32.add
  global.set $enum/NonConstant.ONE
  global.get $enum/NonConstant.ZERO
  drop
  global.get $enum/NonConstant.ONE
  drop
 )
 (func $start (; 2 ;) (type $FUNCSIG$v)
  call $start:enum
 )
 (func $null (; 3 ;) (type $FUNCSIG$v)
 )
)
