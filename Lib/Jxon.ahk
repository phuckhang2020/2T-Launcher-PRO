#Requires AutoHotkey v2.0

; Minimal JSON parser/stringifier for flat script-list data.
; Load() is a generic recursive-descent parser (object/array/string/number/bool/null).
; StringifyArrayOfObjects() is intentionally narrow: it only serializes an array of
; flat objects with string values, in a caller-supplied field order (AHK object property
; enumeration order isn't guaranteed, so callers must pass the order explicitly).
class Jxon {
    static Load(jsonText) {
        this.Text := jsonText
        this.Pos := 1
        this.SkipWs()
        return this.ParseValue()
    }

    static SkipWs() {
        Len := StrLen(this.Text)
        while (this.Pos <= Len) {
            ch := SubStr(this.Text, this.Pos, 1)
            if (ch = " " || ch = "`t" || ch = "`r" || ch = "`n")
                this.Pos++
            else
                break
        }
    }

    static ParseValue() {
        ch := SubStr(this.Text, this.Pos, 1)
        if (ch = "{")
            return this.ParseObject()
        else if (ch = "[")
            return this.ParseArray()
        else if (ch = "`"")
            return this.ParseString()
        else
            return this.ParseLiteral()
    }

    static ParseObject() {
        obj := {}
        this.Pos++ ; consume {
        this.SkipWs()
        if (SubStr(this.Text, this.Pos, 1) = "}") {
            this.Pos++
            return obj
        }
        Loop {
            this.SkipWs()
            key := this.ParseString()
            this.SkipWs()
            if (SubStr(this.Text, this.Pos, 1) != ":")
                throw Error("Jxon.Load: expected ':' near position " this.Pos)
            this.Pos++ ; consume :
            this.SkipWs()
            val := this.ParseValue()
            obj.%key% := val
            this.SkipWs()
            ch := SubStr(this.Text, this.Pos, 1)
            this.Pos++
            if (ch = ",")
                continue
            else if (ch = "}")
                break
            else
                throw Error("Jxon.Load: expected ',' or '}' near position " (this.Pos - 1))
        }
        return obj
    }

    static ParseArray() {
        arr := []
        this.Pos++ ; consume [
        this.SkipWs()
        if (SubStr(this.Text, this.Pos, 1) = "]") {
            this.Pos++
            return arr
        }
        Loop {
            this.SkipWs()
            arr.Push(this.ParseValue())
            this.SkipWs()
            ch := SubStr(this.Text, this.Pos, 1)
            this.Pos++
            if (ch = ",")
                continue
            else if (ch = "]")
                break
            else
                throw Error("Jxon.Load: expected ',' or ']' near position " (this.Pos - 1))
        }
        return arr
    }

    ; Char-by-char scan (not regex) so escaped quotes don't terminate the string early.
    static ParseString() {
        if (SubStr(this.Text, this.Pos, 1) != "`"")
            throw Error("Jxon.Load: expected string near position " this.Pos)
        this.Pos++ ; consume opening quote
        out := ""
        Len := StrLen(this.Text)
        while (this.Pos <= Len) {
            ch := SubStr(this.Text, this.Pos, 1)
            if (ch = "`"") {
                this.Pos++
                return out
            } else if (ch = "\") {
                this.Pos++
                esc := SubStr(this.Text, this.Pos, 1)
                if (esc = "`"")
                    out .= "`""
                else if (esc = "\")
                    out .= "\"
                else if (esc = "/")
                    out .= "/"
                else if (esc = "n")
                    out .= "`n"
                else if (esc = "t")
                    out .= "`t"
                else if (esc = "r")
                    out .= "`r"
                else if (esc = "u") {
                    hex := SubStr(this.Text, this.Pos + 1, 4)
                    out .= Chr(Integer("0x" hex))
                    this.Pos += 4
                } else
                    out .= esc
                this.Pos++
            } else {
                out .= ch
                this.Pos++
            }
        }
        throw Error("Jxon.Load: unterminated string")
    }

    static ParseLiteral() {
        Start := this.Pos
        Len := StrLen(this.Text)
        Delims := ",]} `t`r`n"
        while (this.Pos <= Len) {
            ch := SubStr(this.Text, this.Pos, 1)
            if InStr(Delims, ch)
                break
            this.Pos++
        }
        Token := SubStr(this.Text, Start, this.Pos - Start)
        if (Token = "true")
            return true
        else if (Token = "false")
            return false
        else if (Token = "null")
            return ""
        else if IsNumber(Token)
            return Token + 0
        return Token
    }

    ; Vietnamese and other non-ASCII text is emitted as raw UTF-8, not \uXXXX escapes.
    static EscapeString(s) {
        s := StrReplace(s, "\", "\\")
        s := StrReplace(s, "`"", "\`"")
        s := StrReplace(s, "`n", "\n")
        s := StrReplace(s, "`r", "\r")
        s := StrReplace(s, "`t", "\t")
        return "`"" s "`""
    }

    static StringifyArrayOfObjects(arr, fieldOrder) {
        if (arr.Length = 0)
            return "[]"
        lines := []
        for item in arr
            lines.Push("  " this.StringifyObjectOrdered(item, fieldOrder))
        return "[`n" this.JoinLines(lines, ",`n") "`n]"
    }

    static StringifyObjectOrdered(obj, fieldOrder) {
        parts := []
        for field in fieldOrder
            parts.Push(this.EscapeString(field) ":" this.EscapeString(obj.%field%))
        return "{" this.JoinLines(parts, ",") "}"
    }

    static JoinLines(arr, sep) {
        result := ""
        for index, value in arr {
            result .= value
            if (index < arr.Length)
                result .= sep
        }
        return result
    }
}
