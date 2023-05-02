import lodash_clonedeep from "lodash.clonedeep";

/**
 * This interface should be implemented by classes of objects that are received (over network) as JSON.
 * It's needed to create local objects using correct classes (prototypes).
 */
export interface Reflective {
  /**
   * This method should provide types for non-primitive members that are either:
   * 1. not initialized
   * 2. arrays
   *
   * @param member Name of the class member
   */
  getConstructorFor(member: string): any | null;
}

export function clone(obj: any): any {
  return lodash_clonedeep(obj);
}

export function objectize(obj: any, constructor?: new () => any): any {
  if (obj instanceof Array) {
    // let i = 0;
    for (let i = 0; i < obj.length; i++) {
      obj[i] = objectize(obj[i], constructor);
    }
  } else if (isObject(obj)) {
    if (constructor != null) {
      const newObj = new constructor();
      for (const memberName of Object.keys(obj)) {
        const member = obj[memberName];
        const newMember = newObj[memberName];
        if (member instanceof Array) {
          // let i = 0;
          for (let i = 0; i < member.length; i++)
            member[i] = objectize(
              member[i],
              getMemberConstructor(newObj, memberName, null)
            );
        } else {
          obj[memberName] = objectize(
            member,
            getMemberConstructor(newObj, memberName, newMember)
          );
        }
      }
      obj = Object.assign(newObj, obj);
    }
  }
  return obj;
}

function isObject(obj: any): boolean {
  return obj === Object(obj);
}

function getMemberConstructor(
  container: any,
  member: string,
  obj: any | null
): any | null {
  let constructor = null;
  if (container.getConstructorFor != null)
    constructor = container.getConstructorFor(member);
  if (constructor == null && obj != null && isObject(obj))
    constructor = Object.getPrototypeOf(obj).constructor;
  return constructor;
}
