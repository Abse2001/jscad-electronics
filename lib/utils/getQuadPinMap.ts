export type PinOrderSpecifier =
  | "leftside"
  | "topside"
  | "rightside"
  | "bottomside"
  | "toppin"
  | "bottompin"
  | "leftpin"
  | "rightpin"
export const getQuadPinMap = ({
  num_pins,
  cw,
  ccw,
  startingpin,
}: {
  num_pins: number
  cw?: boolean
  ccw?: boolean
  startingpin?: PinOrderSpecifier[]
}): number[] => {
  const pin_map: number[] = []
  const pins_per_side = num_pins / 4
  let current_position_ccw_normal = 1

  /** Starting Flag Pins */
  const sfp: Record<PinOrderSpecifier, boolean> = {} as any
  for (const specifier of startingpin ?? []) {
    sfp[specifier] = true
  }
  if (!sfp.leftside && !sfp.topside && !sfp.rightside && !sfp.bottomside) {
    sfp.leftside = true
  }
  if (!sfp.bottompin && !sfp.leftpin && !sfp.rightpin && !sfp.toppin) {
    if (sfp.leftside) {
      sfp.toppin = true
    } else if (sfp.topside) {
      sfp.rightpin = true
    } else if (sfp.rightside) {
      sfp.bottompin = true
    } else if (sfp.bottomside) {
      sfp.leftpin = true
    }
  }

  if (sfp.leftside && sfp.toppin) {
    current_position_ccw_normal = 1
  } else if (sfp.leftside && sfp.bottompin) {
    current_position_ccw_normal = pins_per_side
  } else if (sfp.bottomside && sfp.leftpin) {
    current_position_ccw_normal = pins_per_side + 1
  } else if (sfp.bottomside && sfp.rightpin) {
    current_position_ccw_normal = pins_per_side * 2
  } else if (sfp.rightside && sfp.bottompin) {
    current_position_ccw_normal = pins_per_side * 2 + 1
  } else if (sfp.rightside && sfp.toppin) {
    current_position_ccw_normal = pins_per_side * 3
  } else if (sfp.topside && sfp.rightpin) {
    current_position_ccw_normal = pins_per_side * 3 + 1
  } else if (sfp.topside && sfp.leftpin) {
    current_position_ccw_normal = pins_per_side * 4
  }

  pin_map.push(-1) // the first index is meaningless

  // Each iteration we move the current position to the next pin, if we're
  // going CCW this means incrementing, if we're going CW this means
  // decrementing
  for (let i = 0; i < num_pins; i++) {
    pin_map[current_position_ccw_normal] = i + 1
    if (ccw || !cw) {
      current_position_ccw_normal++
      if (current_position_ccw_normal > num_pins) {
        current_position_ccw_normal = 1
      }
    } else {
      current_position_ccw_normal--
      if (current_position_ccw_normal < 1) {
        current_position_ccw_normal = num_pins
      }
    }
  }

  return pin_map
}
