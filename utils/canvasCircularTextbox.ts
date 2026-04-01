// utils/canvasCircularTextbox.ts

import { Textbox, classRegistry } from 'fabric'
import type { SerializedTextboxProps } from 'fabric'

/**
 * Serialized representation of a CircularTextbox.
 * Extends SerializedTextboxProps to include the textRadius property,
 * ensuring it is persisted when the canvas state is saved.
 */
export interface SerializedCircularTextboxProps extends SerializedTextboxProps {
  textRadius: number
  baseWidth: number
}

/**
 * A Textbox subclass that supports circular text paths.
 *
 * Extends Fabric's Textbox with a `textRadius` property that is properly
 * serialized and deserialized when canvas state is saved/restored via Pinia.
 * This solves the problem of `textRadius` not being part of the standard
 * `SerializedTextboxProps` and therefore being lost on save.
 *
 * The class is registered in Fabric's classRegistry so that
 * `canvas.loadFromJSON` can instantiate the correct type when restoring.
 */
export class CircularTextbox extends Textbox {
  static override type = 'CircularTextbox'

  /** Radius of the circular text path. 0 means no path (normal text layout). */
  declare textRadius: number

  /** Width to use for textbox layout independently of the circular path radius. */
  declare baseWidth: number

  static override ownDefaults = {
    textRadius: 0,
    baseWidth: 0,
  }

  static override getDefaults(): Record<string, unknown> {
    return { ...super.getDefaults(), ...CircularTextbox.ownDefaults }
  }

  /**
   * Serializes the object to a plain JS object, including textRadius.
   *
   * The @ts-expect-error below is intentional: Fabric's `toObject` uses highly complex
   * nested generics (TClassProperties<this>) that TypeScript cannot reconcile when the
   * subclass adds new properties to TClassProperties. The override is semantically correct
   * — the return type is a strict superset of the parent's, and the runtime behaviour is
   * identical to the parent plus the extra `textRadius` field.
   */
  // @ts-expect-error: see comment above — Fabric generic constraint prevents clean override
  override toObject(propertiesToInclude: string[] = []): SerializedCircularTextboxProps {
    const base = super.toObject(propertiesToInclude as never) as SerializedTextboxProps
    return { ...base, textRadius: this.textRadius, baseWidth: this.baseWidth }
  }

  /**
   * Restores a CircularTextbox from a serialized object.
   * textRadius is restored via the ownDefaults + toObject mechanism.
   */
  static override async fromObject(object: SerializedCircularTextboxProps): Promise<CircularTextbox> {
    return (await super.fromObject(object)) as CircularTextbox
  }
}

// Register so that canvas.loadFromJSON can instantiate the correct class
classRegistry.setClass(CircularTextbox)
