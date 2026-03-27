/**
 * FlexSearch 类型声明
 * 由于 flexsearch 包没有完整的 TypeScript 类型，我们在这里补充
 */

declare module 'flexsearch' {
  export interface IndexOptions {
    profile?: 'memory' | 'speed' | 'match' | 'balance' | 'fast'
    charset?: string | Charset
    tokenize?: string | boolean
    resolution?: number
    optimize?: boolean
    context?: {
      depth?: number
      resolution?: number
      bidirectional?: boolean
    }
    threshold?: number | number[]
    minlength?: number
    charsetwise?: boolean
    encode?: (str: string) => string[]
    rtl?: boolean
    async?: boolean
    worker?: boolean
  }

  export interface Charset {
    chars: { [key: string]: string }
  }

  export interface Document {
    id?: string | number
    field?: string | string[]
    [key: string]: any
  }

  export class Index {
    constructor(options?: IndexOptions)

    add(id: string | number, content: string): boolean
    add(id: string | number, content: string[], boost?: number): boolean
    add(document: Document): boolean

    append(id: string | number, content: string): boolean
    append(id: string | number, content: string[], boost?: number): boolean
    append(document: Document): boolean

    update(id: string | number, content: string): boolean
    update(id: string | number, content: string[], boost?: number): boolean
    update(document: Document): boolean

    remove(id: string | number): boolean

    search(query: string, limit?: number, suggest?: boolean): (string | number)[]
    search(
      query: string[],
      limit?: number,
      suggest?: boolean
    ): (string | number)[]

    where(filter: (doc: any) => boolean): any[]

    export(): any
    import(data: any): void
  }

  export class Document {
    constructor(options?: {
      id?: string
      field?: string | string[]
      document?: {
        id?: string
        field?: string | string[]
        [key: string]: any
      }
      index?: {
        [key: string]: IndexOptions | boolean
      }
      charset?: string | Charset
      tokenize?: string | boolean
      threshold?: number | number[]
      depth?: number
      resolution?: number
      minlength?: number
      encode?: (str: string) => string[]
      rtl?: boolean
      async?: boolean
      worker?: boolean
      tag?: boolean
    })

    add(id: string | number, document: any): boolean
    append(id: string | number, document: any): boolean
    update(id: string | number, document: any): boolean
    remove(id: string | number): boolean
    search(
      query: string,
      limit?: number,
      operator?: 'AND' | 'OR' | 'AND_NOT'
    ): any[]
    where(filter: (doc: any) => boolean): any[]
    export(): any
    import(data: any): void
  }

  export class Worker {
    constructor(options?: IndexOptions)
    add(id: string | number, content: string): boolean
    remove(id: string | number): boolean
    search(query: string, limit?: number): Promise<(string | number)[]>
  }
}
