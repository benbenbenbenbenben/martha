type ternaryif is macro<statement>:
    void: pattern(passvalue:expression, string:_{"if"}, test:expression, string:_{"else"}, failvalue:expression):
        emit:
            if test:
                passvalue
            else:
                failvalue

