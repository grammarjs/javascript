
/**
 * Module dependencies.
 */

var Grammar = require('grammarjs-grammar');
var puncuation = require('grammarjs-punctuation');
var unicode = require('grammarjs-unicode');
var grammar = new Grammar('javascript');
var rule = grammar.rule;
var value = Token.value;
var passthrough = Token.passthrough;

/**
 * Expose `grammar`.
 */

module.exports = grammar;

/**
 * Plugins.
 */

grammar.use(puncuation());
grammar.use(unicode());

/**
 * JavaScript
 */

rule('javascript')
  .match(
    ':ws',
    ':program',
    ':ws', passthrough);

rule('whitespace')
  .match(
    '\t', value)
  .match(
    '\v', value)
  .match(
    '\f', value)
  .match(
    ' ', value)
  .match(
    '\u00A0', value)
  .match(
    '\uFEFF', value)
  .match(
    ':separator', passthrough);

/**
 * Comments.
 */

rule('comment')
  .match(
    ':comment.multiline',
    passthrough)
  .match(
    ':comment.singleline',
    passthrough);

rule('comment.multiline')
  .match(
    ':comment.block.begin',
    ':comment.multiline.body*',
    ':comment.block.end',
    passthrough);

rule('comment.multiline.body')
  .match(
    ':comment.block.end!',
    ':character.source',
    passthrough)

rule('comment.multiline.no-line-terminator')
  .match(
    ':comment.block.begin',
    ':comment.multiline.no-line-terminator.body*',
    ':comment.block.end',
    passthrough);

rule('comment.multiline.no-line-terminator.body')
  .match(
    '!:comment.multiline.no-line-terminator.body.not',
    ':character.source',
    passthrough);

rule('comment.multiline.no-line-terminator.body.not')
  .match(
    ':comment.block.end',
    passthrough)
  .match(
    ':whitespace.line.end',
    passthrough);

rule('comment.singleline')
  .match(
    '//',
    ':comment.singleline.body*',
    passthrough);

rule('comment.singleline.body')
  .match(
    '!:whitespace.line.terminator',
    ':character.source',
    passthrough);

rule('comment.block.begin')
  .match(
    '/*',
    value);

rule('comment.block.end')
  .match(
    '*/',
    value);

/**
 * Identifiers.
 */

rule('identifier.whitespace')
  .match(
    ':identifier',
    ':whitespace.multiline',
    passthrough);

rule('identifier')
  .match(
    ':identifier.start',
    ':identifier.part*',
    passthrough);

rule('identifier.start')
  .match(
    ':letter.unicode',
    passthrough)
  .match(
    ':punctuation.dollar',
    value)
  .match(
    ':punctuation.underscore',
    value)
  .match(
    ':punctuation.backslash',
    ':unicode-escape-sequence',
    passthrough);

rule('identifier.part')
  .match(
    ':identifier.start',
    passthrough)
  .match(
    ':unicode.combining-mark',
    passthrough)
  .match(
    ':unicode.digit',
    passthrough)
  .match(
    ':unicode.connector-punctuation',
    passthrough)
  .match(
    "\u200C",
    value)
  .match(
    "\u200D",
    value);

rule('unicode.combining-mark')
  .match(
    ':Mn')
  .match(
    ':Mc');

rule('unicode.digit')
  .match(
    ':Nd');

rule('unicode.connector-punctuation')
  .match(
    ':Pc');

rule('unicode.letter')
  .match(
    ':Lu')
  .match(
    ':Ll')
  .match(
    ':Lt')
  .match(
    ':Lm')
  .match(
    ':Lo')
  .match(
    ':Nl');

rule('keyword.reserved')
  .match(
    ':keyword')
  .match(
    ':keyword.reserved.future')
  .match(
    ':literal.null')
  .match(
    ':literal.boolean');

/**
 * Keywords.
 */

rule('keyword.future.reserved')
  .match(
    ':keyword.class')
  .match(
    ':keyword.const')
  .match(
    ':keyword.enum')
  .match(
    ':keyword.export')
  .match(
    ':keyword.extends')
  .match(
    ':keyword.imports')
  .match(
    ':keyword.super');

/**
 * Literals.
 */

rule('literal')
  .match(
    ':literal.null')
  .match(
    ':literal.boolean')
  .match(
    ':literal.number')
  .match(
    ':literal.string')
  .match(
    ':literal.regular-expression');

rule('literal.null')
  .match(':keyword.null');

rule('literal.boolean')
  .match(
    ':keyword.true')
  .match(
    ':keyword.false');

rule('literal.number')
  .match(
    ':literal.integer.hex',
    '!:literal.number.helper')
  .match(
    ':literal.decimal',
    '!:literal.number.helper');

rule('literal.number.helper')
  .match(
    ':identifier.begin')
  .match(
    ':literal.digit.decimal');

rule('literal.decimal')
  .match(
    ':literal.decimal.integer',
    ':punctuation.period',
    ':literal.digit.decimal*',
    ':exponent.part?')
  .match(
    ':punctuation.period',
    ':literal.digit.decimal+',
    ':exponent.part?')
  .match(
    ':literal.decimal.integer',
    ':exponent.part?');

rule('literal.decimal.integer')
  .match(
    '0')
  .match(
    ':literal.digit.non-zero',
    ':literal.digit.decimal*');

rule('literal.digit.decimal')
  .match(
    /[0-9]/);

rule('literal.digit.non-zero')
  .match(
    /[1-9]/);

rule('exponent.part')
  .match(
    ':exponent.indicator',
    ':integer.signed');

rule('exponent.indicator')
  .match(
    /e/i);

rule('integer.signed')
  .match(
    ':operator.sign?',
    ':literal.digit.decimal+');

rule('operator.sign')
  .match(
    /[+-]/,
    value);

rule('literal.integer.hex')
  .match(
    /0x/i,
    ':digit.hex+');

rule('digit.hex')
  .match(
    /[0-9a-f]/i);

rule('literal.string')
  .match(
    ':punctuation.quote.double',
    ':string.double.character*',
    ':punctuation.quote.double')
  .match(
    ':punctuation.quote.single',
    ':string.character.single*',
    ':punctuation.quote.single');

rule('string.double.character')
  .match(
    '!:string.double.character.helper',
    ':character.source')
  .match(
    ':punctuation.backslash',
    ':escape.sequence')
  .match(
    ':whitespace.line.continuation');

rule('string.double.character.helper')
  .match(
    '"')
  .match(
    ':punctuation.backslash')
  .match(
    ':whitespace.line.end');

rule('string.character.single')
  .match(
    '!:string.character.single.helper',
    ':character.source')
  .match(
    ':punctuation.backslash',
    ':escape.sequence')
  .match(
    ':whitespace.line.continuation');

rule('string.character.single.helper')
  .match(':string.quote.single')
  .match(':punctuation.backslash')
  .match(':whitespace.line.end');

rule('whitespace.line.continuation')
  .match(
    ':punctuation.backslash',
    ':whitespace.line.terminator-sequence');

rule('escape.sequence')
  .match(
    ':character.escaped.sequence')
  .match(
    '0',
    '!:literal.digit.decimal')
  .match(
    ':escape.hex.sequence')
  .match(
    ':escape.unicode.sequence');

rule('character.escaped.sequence')
  .match(
    ':character.escaped.single')
  .match(
    ':character.unescaped');

rule('character.escaped.single')
  .match(
    ':string.quote.single')
  .match(
    ':string.quote.double')
  .match(
    ':punctuation.backslash')
  // .match('b', { return "\b";   })
  // .match('f', { return "\f";   })
  // .match('n', { return "\n";   })
  // .match('r', { return "\r";   })
  // .match('t', { return "\t";   })
  // .match('v', { return "\x0B"; }); // IE does not recognize "\v".

rule('character.unescaped')
  .match(
    '!:character.unescaped.helper',
    ':character.source');

rule('character.unescaped.helper')
  .match(
    ':character.escaped')
  .match(
    ':whitespace.line.end');

rule('character.escaped')
  .match(
    ':character.escaped.single')
  .match(
    ':literal.digit.decimal')
  .match(
    'x')
  .match(
    'u');

rule('escape.hex.sequence')
  .match(
    'x',
    ':digit.hex',
    ':digit.hex');

rule('escape.unicode.sequence')
  .match(
    'u',
    ':digit.hex',
    ':digit.hex',
    ':digit.hex',
    ':digit.hex');

/**
 * Regular expressions.
 */

rule('literal.regular-expression')
  .match(
    ':punctuation.slash.forward',
    ':regexp.body',
    ':punctuation.slash.forward',
    ':regexp.flag');

rule('regexp.body')
  .match(
    ':regexp.character.first',
    ':regexp.character*')

rule('regexp.character.first')
  .match(
    '!:regexp.character.first.not',
    ':regexp.non-terminator')
  .match(
    ':regexp.backslash.sequence')
  .match(
    ':regexp.class');

rule('regexp.character.first.not')
  .match(
    /[\*\\\/\[]/);

rule('regexp.character')
  .match(
    '!:regexp.character.not',
    ':regexp.non-terminator')
  .match(
    ':regexp.backslash.sequence')
  .match(
    ':regexp.class');

rule('regexp.character.not')
  .match(
    /[\\\/\[]/);

rule('regexp.backslash.sequence')
  .match(
    ':punctuation.backslash',
    ':regexp.non-terminator');

rule('regexp.non-terminator')
  .match(
    '!:whitespace.line.end',
    ':character.source');

rule('regexp.class')
  .match(
    ':punctuation.bracket.square.begin',
    ':regexp.class.character*',
    ':punctuation.bracket.square.end');

rule('regexp.class.character')
  .match(
    '!:regexp.class.character.not',
    ':regexp.non-terminator')
  .match(
    ':regexp.backslash.sequence');

rule('regexp.class.character.not')
  .match(/[\]\\]/);

rule('regexp.flag')
  .match(
    ':identifier.part*');

/**
 * Keywords.
 */

keyword('break');
keyword('case');
keyword('catch');
keyword('class');
keyword('const');
keyword('continue');
keyword('debugger');
keyword('default');
keyword('delete');
keyword('do');
keyword('else');
keyword('enum');
keyword('export');
keyword('extends');
keyword('false');
keyword('finally');
keyword('for');
keyword('function');
keyword('get');
keyword('if');
keyword('import');
keyword('instanceof');
keyword('in');
keyword('new');
keyword('null');
keyword('return');
keyword('set');
keyword('super');
keyword('switch');
keyword('this');
keyword('throw');
keyword('true');
keyword('try');
keyword('typeof');
keyword('var');
keyword('void');
keyword('while');
keyword('with');

/**
 * Whitespace.
 */

rule('whitespace.multiline')
  .match(
    ':whitespace.multiline.character*');

rule('whitespace.multiline.character')
  .match(
    ':whitespace')
  .match(
    ':whitespace.line.terminator-sequence')
  .match(
    ':comment');

rule(':whitespace.simple')
  .match(':whitespace.simple.character*');

rule('whitespace.simple.character')
  .match(
    ':whitespace')
  .match(
    ':comment.multiline.no-line-terminator');

rule('whitespace.eos')
  .match(
    ':whitespace.multiline',
    ':punctuation.semicolon')
  .match(
    ':whitespace.simple',
    ':SingleLinecomment?',
    ':whitespace.line.terminator-sequence')
  .match(
    ':whitespace.simple',
    '&:punctuation.bracket.square.end')
  .match(
    ':whitespace.multiline',
    ':whitespace.eof');

rule('whitespace.eof')
  .match(
    '!:punctuation.period');

rule('expression.primary')
  .match(
    ':keyword.this')
  .match(
    ':identifier')
  .match(
    ':literal')
  .match(
    ':literal.array')
  .match(
    ':literal.object')
  .match(
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':expression',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.end')

rule('literal.array')
  .match(
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':elision?',
    ':punctuation.bracket.square.end')
  .match(
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':element.list',
    ':whitespace.multiline',
    ':punctuation.bracket.square.end')
  .match(
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':element.list',
    ':whitespace.multiline',
    ':punctuation.comma',
    ':whitespace.multiline',
    ':elision?',
    ':punctuation.bracket.square.end');

rule('element.list')
  .match(
    ':element.list.begin',
    ':element.list.end*');

rule('element.list.begin')
  .match(
    ':elision?',
    ':expression.assignment');

rule('element.list.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.comma',
    ':whitespace.multiline',
    ':elision?',
    ':expression.assignment');

rule('elision')
  .match(
    ':punctuation.comma',
    ':elision.end*',
    ':whitespace.multiline');

rule('elision.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.comma');

rule('literal.object')
  .match(
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':punctuation.bracket.square.end')
  .match(
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':list.property-name-and-value',
    ':whitespace.multiline',
    ':punctuation.bracket.square.end')
  .match(
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':list.property-name-and-value',
    ':whitespace.multiline',
    ':punctuation.comma',
    ':whitespace.multiline',
    ':punctuation.bracket.square.end');

rule('list.property-name-and-value')
  .match(
    ':assignment.property',
    ':list.property-name-and-value.end*');

rule('list.property-name-and-value.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.comma',
    ':whitespace.multiline',
    ':assignment.property')

rule('assignment.property')
  .match(
    ':property-name',
    ':whitespace.multiline',
    ':punctuation.colon',
    ':whitespace.multiline',
    ':expression.assignment')
  .match(
    ':keyword.get',
    ':whitespace.multiline',
    ':property-name',
    ':whitespace.multiline')
  .match(
    ':keyword.set',
    ':whitespace.multiline',
    ':property-name',
    ':whitespace.multiline');

rule('property-name')
  .match(
    ':identifier.name')
  .match(
    ':literal.string')
  .match(
    ':literal.number')

rule('list.property-set-parameter')
  .match(
    ':identifier');

rule('expression.member')
  .match(
    ':member-expression.begin',
    ':member-expression.end*');

rule('member-expression.begin')
  .match(
    ':expression.primary')
  .match(
    ':expression.function')
  .match(
    ':keyword.new',
    ':whitespace.multiline',
    ':expression.member',
    ':whitespace.multiline',
    ':arguments');

rule('member-expression.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':expression',
    ':whitespace.multiline',
    ':punctuation.bracket.square.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.period',
    ':whitespace.multiline',
    ':identifier.name');

rule('expression.new')
  .match(
    ':expression.member')
  .match(
    ':keyword.new',
    ':whitespace.multiline',
    ':expression.new');

rule('expression.call')
  .match(
    ':expression.call.begin',
    ':expression.call.end');

rule('expression.call.begin')
  .match(
    ':expression.member',
    ':whitespace.multiline',
    ':arguments');

rule('expression.call.end')
  .match(
    ':whitespace.multiline',
    ':arguments')
  .match(
    ':whitespace.multiline',
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':expression',
    ':whitespace.multiline',
    ':punctuation.bracket.square.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.period',
    ':whitespace.multiline',
    ':identifier.name');

rule('arguments')
  .match(
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':arguments.list.whitespace?',
    ':punctuation.bracket.parenthesis.end');

rule('arguments.list.whitespace')
  .match(
    ':arguments.list',
    ':whitespace.multiline');

rule('arguments.list')
  .match(
    ':expression.assignment',
    ':arguments.list.end*');

rule('arguments.list.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.comma',
    ':whitespace.multiline',
    ':expression.assignment');

rule('expression.left')
  .match(
    ':expression.call')
  .match(
    ':expression.new');

rule('expression.postfix')
  .match(
    ':expression.left',
    ':whitespace.simple',
    ':operator.postfix')
  .match(
    ':expression.left');

rule('operator.postfix')
  .match('++')
  .match('--');

rule('expression.unary')
  .match(
    ':expression.postfix')
  .match(
    ':operator.unary',
    ':whitespace.multiline',
    ':expression.unary');

rule('operator.unary')
  .match(
    ':keyword.delete')
  .match(
    ':keyword.void')
  .match(
    ':keyword.typeof')
  .match(
    '++')
  .match(
    '--')
  .match(
    '+',
    '!:operator.equal')
  .match(
    '-',
    '!:operator.equal')
  .match(
    '~')
  .match(
    '!');

rule('expression.multiplicative')
  .match(
    ':expression.unary',
    ':expression.multiplicative.end*');

rule('expression.multiplicative.end')
  .match(
    ':whitespace.multiline',
    ':operator.multiplicative',
    ':whitespace.multiline',
    ':expression.unary');

rule('operator.multiplicative')
  .match(
    '*',
    '!:operator.equal')
  .match(
    ':punctuation.slash.forward',
    '!:operator.equal')
  .match(
    ':operator.modulus',
    '!:operator.equal')

rule('expression.additive')
  .match(
    ':expression.multiplicative',
    ':expression.additive.end*');

rule('expression.additive.end')
  .match(
    ':whitespace.multiline',
    ':operator.additive',
    ':whitespace.multiline',
    ':expression.multiplicative');

rule('operator.additive')
  .match(
    '+',
    !/[+=]/)
  .match(
    '-',
    !/[-=]/);

rule('expression.shift')
  .match(
    ':expression.additive',
    ':expression.shift.end*');

rule('expression.shift.end')
  .match(
    ':whitespace.multiline',
    ':operator.shift',
    ':whitespace.multiline',
    ':expression.additive');

rule('operator.shift')
  .match(
    '<<',
    '!:operator.equal')
  .match(
    '>>>',
    '!:operator.equal')
  .match(
    '>>',
    '!:operator.equal');

rule('expression.relational')
  .match(
    ':expression.shift',
    ':expression.relational.end*');

rule('expression.relational.end')
  .match(
    ':whitespace.multiline',
    ':operator.relational',
    ':whitespace.multiline',
    ':expression.shift');

rule('operator.relational')
  .match(
    '<=')
  .match(
    '>=')
  .match(
    '<',
    '!:operator.lt')
  .match(
    '>',
    '!:operator.gt')
  .match(
    ':keyword.instanceof')
  .match(
    ':keyword.in');

rule('expression.relational.not-in')
  .match(
    ':expression.shift',
    ':expression.relational.not-in.end*');

rule('expression.relational.not-in.end')
  .match(
    ':whitespace.multiline',
    ':operator.relational.not-in',
    ':whitespace.multiline',
    ':expression.shift');

rule('operator.relational.not-in')
  .match(
    '<=')
  .match(
    '>=')
  .match(
    '<',
    '!:operator.lt')
  .match(
    '>',
    '!:operator.gt')
  .match(
    ':keyword.instanceof');

rule('expression.equality')
  .match(
    ':expression.relational',
    ':expression.equality.end*');

rule('expression.equality.end')
  .match(
    ':whitespace.multiline',
    ':operator.equality',
    ':whitespace.multiline',
    ':expression.relational');

rule('expression.equality.not-in')
  .match(
    ':expression.relational.not-in',
    ':expression.equality.not-in.end*');

rule('expression.equality.not-in.end')
  .match(
    ':whitespace.multiline',
    ':operator.equality',
    ':whitespace.multiline',
    ':expression.relational.not-in');

rule('operator.equality')
  .match(
    '===')
  .match(
    '!==')
  .match(
    '==')
  .match(
    '!=');

rule('expression.bitwise.and')
  .match(
    ':expression.equality',
    ':expression.bitwise.and.end*');

rule('expression.bitwise.and.end')
  .match(
    ':whitespace.multiline',
    ':operator.bitwise.and',
    ':whitespace.multiline',
    ':expression.equality');

rule('expression.bitwise.and.not-in')
  .match(
    ':expression.equality.not-in',
    ':expression.bitwise.and.not-in.end*');

rule('expression.bitwise.and.not-in.end')
  .match(
    ':whitespace.multiline',
    ':operator.bitwise.and',
    ':whitespace.multiline',
    ':expression.equality.not-in');

rule('operator.bitwise.and')
  .match(
    '&',
    !/[&=]/);

rule('expression.bitwise.xor')
  .match(
    ':expression.bitwise.and',
    ':expression.bitwise.xor.end*');

rule('expression.bitwise.xor.end')
  .match(
    ':whitespace.multiline',
    ':operator.bitwise.xor',
    ':whitespace.multiline',
    ':expression.bitwise.and');

rule('expression.bitwise.xor.not-in')
  .match(
    ':expression.bitwise.and.not-in',
    ':expression.bitwise.xor.not-in.end');

rule('expression.bitwise.xor.not-in.end')
  .match(
    ':whitespace.multiline',
    ':operator.bitwise.xor',
    ':whitespace.multiline',
    ':expression.bitwise.and.not-in');

rule('operator.bitwise.xor')
  .match(
    '^',
    '!:operator.equal');

rule('expression.bitwise.or')
  .match(
    ':expression.bitwise.xor',
    ':expression.bitwise.xor.end*');

rule('expression.bitwise.xor.end')
  .match(
    ':whitespace.multiline',
    ':operator.bitwise.or',
    ':whitespace.multiline',
    ':expression.bitwise.xor');

rule('expression.bitwise.or.not-in')
  .match(
    ':expression.bitwise.xor.not-in',
    ':expression.bitwise.or.not-in.end*');

rule('expression.bitwise.or.not-in.end')
  .match(
    ':whitespace.multiline',
    ':operator.bitwise.or',
    ':whitespace.multiline',
    ':expression.bitwise.xor.not-in');

rule('operator.bitwise.or')
  .match(
    '|',
    !/[|=]/);

rule('expression.logical.and')
  .match(
    ':expression.bitwise.or',
    ':expression.logical.and.end*');

rule('expression.logical.and.end')
  .match(
    ':whitespace.multiline',
    ':operator.logical.and',
    ':whitespace.multiline',
    ':expression.bitwise.or');

rule('expression.logical.and.not-in')
  .match(
    ':expression.bitwise.or.not-in',
    ':expression.logical.and.not-in.end*');

rule('expression.logical.and.not-in.end')
  .match(
    ':whitespace.multiline',
    ':operator.logical.and',
    ':whitespace.multiline',
    ':expression.bitwise.or.not-in');

rule('operator.logical.and')
  .match(
    '&&');

rule('expression.logical.or')
  .match(
    ':expression.logical.and',
    ':expression.logical.or.end*');

rule('expression.logical.or.end')
  .match(
    ':whitespace.multiline',
    ':operator.logical.or',
    ':whitespace.multiline',
    ':expression.logical.and');

rule('expression.logical.or.not-in')
  .match(
    ':expression.logical.and.not-in',
    ':expression.logical.or.not-in.end');

rule('expression.logical.or.not-in.end')
  .match(
    ':whitespace.multiline',
    ':operator.logical.or',
    ':whitespace.multiline',
    ':expression.logical.and.not-in');

rule('operator.logical.or')
  .match(
    '||');

rule('expression.conditional')
  .match(
    ':expression.logical.or',
    ':whitespace.multiline',
    ':punctuation.question-mark',
    ':whitespace.multiline',
    ':expression.assignment',
    ':whitespace.multiline',
    ':punctuation.colon',
    ':whitespace.multiline',
    ':expression.assignment')
  .match(
    ':expression.logical.or');

rule('expression.conditional.not-in')
  .match(
    ':expression.logical.or.not-in',
    ':whitespace.multiline',
    ':punctuation.question-mark',
    ':whitespace.multiline',
    ':expression.assignment',
    ':whitespace.multiline',
    ':punctuation.colon',
    ':whitespace.multiline',
    ':expression.assignment.not-in')
  .match(
    ':expression.logical.or.not-in');

rule('expression.assignment')
  .match(
    ':expression.left',
    ':whitespace.multiline',
    ':operator.equal',
    '!:operator.equal',
    ':whitespace.multiline',
    ':expression.assignment')
  .match(
    ':expression.left',
    ':whitespace.multiline',
    ':operator.assignment',
    ':whitespace.multiline',
    ':expression.assignment')
  .match(
    ':expression.conditional');

rule('expression.assignment.not-in')
  .match(
    ':expression.left',
    ':whitespace.multiline',
    ':operator.equal',
    '!:operator.equal',
    ':whitespace.multiline',
    ':expression.assignment.not-in')
  .match(
    ':expression.left',
    ':whitespace.multiline',
    ':operator.assignment',
    ':whitespace.multiline',
    ':expression.assignment.not-in')
  .match(
    ':expression.conditional.not-in');

rule('operator.assignment')
  .match(
    '*=')
  .match(
    '/=')
  .match(
    '%=')
  .match(
    '+=')
  .match(
    '-=')
  .match(
    '<<=')
  .match(
    '>>=')
  .match(
    '>>>=')
  .match(
    '&=')
  .match(
    '^=')
  .match(
    '|=');

rule('expression.whitespace')
  .match(
    ':expression',
    ':whitespace.multiline');

rule('expression')
  .match(
    ':expression.assignment',
    ':expression.end*');

rule('expression.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.comma',
    ':whitespace.multiline',
    ':expression.assignment');

rule('expression.not-in.whitespace')
  .match(
    ':expression.not-in',
    ':whitespace.multiline');

rule('expression.not-in')
  .match(
    ':expression.assignment.not-in',
    ':expression.not-in.end*');

rule('expression.not-in.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.comma',
    ':whitespace.multiline',
    ':expression.assignment.not-in');

rule('statement')
  .match(
    ':block')
  .match(
    ':statement.variable')
  .match(
    ':statement.empty')
  .match(
    ':statement.expression')
  .match(
    ':statement.if')
  .match(
    ':statement.iteration')
  .match(
    ':statement.continue')
  .match(
    ':statement.break')
  .match(
    ':statement.return')
  .match(
    ':statement.with')
  .match(
    ':statement.labelled')
  .match(
    ':statement.switch')
  .match(
    ':statement.throw')
  .match(
    ':statement.try')
  .match(
    ':statement.debugger');

rule('block')
  .match(
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':statement.list?',
    ':whitespace.multiline?',
    ':punctuation.bracket.square.end');

rule('statement.list')
  .match(
    ':statement',
    ':statement.list.end*');

rule('statement.list.end')
  .match(
    ':whitespace.multiline',
    ':statement');

rule('statement.variable')
  .match(
    ':keyword.var',
    ':whitespace.multiline',
    ':declaration.variable.list',
    ':whitespace.eos');

rule('declaration.variable.list')
  .match(
    ':declaration.variable',
    ':declaration.variable.list.end*');

rule('declaration.variable.list.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.comma',
    ':whitespace.multiline',
    ':declaration.variable');

rule('declaration.variable.list.not-in')
  .match(
    ':declaration.variable.not-in',
    ':declaration.variable.list.not-in.end*');

rule('declaration.variable.list.not-in.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.comma',
    ':whitespace.multiline',
    ':declaration.variable.not-in');

rule('declaration.variable')
  .match(
    ':identifier',
    ':declaration.variable.end?');

rule('declaration.variable.end')
  .match(
    ':whitespace.multiline',
    ':initializer');

rule('declaration.variable.not-in')
  .match(
    ':identifier',
    ':declaration.variable.not-in?');

rule('declaration.variable.not-in.end')
  .match(
    ':whitespace.multiline',
    ':initializer.not-in');

rule('initializer')
  .match(
    ':operator.equal',
    '!:operator.equal',
    ':whitespace.multiline',
    ':expression.assignment');

rule('initializer.not-in')
  .match(
    ':operator.equal',
    '!:operator.equal',
    ':whitespace.multiline',
    ':expression.assignment.not-in');

rule('statement.empty')
  .match(
    ':punctuation.semicolon');

rule('statement.expression')
  .match(
    '!:statement.expression.not',
    ':expression',
    ':whitespace.eos');

rule('statement.expression.not')
  .match(
    ':punctuation.bracket.square.begin')
  .match(
    ':keyword.function');

rule('statement.if')
  .match(
    ':keyword.if',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':expression',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':statement',
    ':whitespace.multiline',
    ':keyword.else',
    ':whitespace.multiline',
    ':statement')
  .match(
    ':keyword.if',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':expression',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':statement');

rule('statement.iteration')
  .match(
    ':keyword.do',
    ':whitespace.multiline',
    ':statement',
    ':whitespace.multiline',
    ':keyword.while',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':expression',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.eos')
  .match(
    ':keyword.while',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':expression',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':statement')
  .match(
    ':keyword.for',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':expression.not-in.whitespace?',
    ':punctuation.semicolon',
    ':whitespace.multiline',
    ':expression.whitespace?',
    ':punctuation.semicolon',
    ':whitespace.multiline',
    ':expression.whitespace?',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':statement')
  .match(
    ':keyword.for',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':keyword.var',
    ':whitespace.multiline',
    ':declaration.variable.list.not-in',
    ':whitespace.multiline',
    ':punctuation.semicolon',
    ':whitespace.multiline',
    ':expression.whitespace?',
    ':punctuation.semicolon',
    ':whitespace.multiline',
    ':expression.whitespace?',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':statement')
  .match(
    ':keyword.for',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':expression.left',
    ':whitespace.multiline',
    ':keyword.in',
    ':whitespace.multiline',
    ':expression',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':statement')
  .match(
    ':keyword.for',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':keyword.var',
    ':whitespace.multiline',
    ':declaration.variable.list.not-in',
    ':whitespace.multiline',
    ':keyword.in',
    ':whitespace.multiline',
    ':expression',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':statement');

rule('statement.continue')
  .match(
    ':keyword.continue',
    ':whitespace.eos')
  .match(
    ':keyword.continue',
    ':whitespace.simple',
    ':identifier',
    ':whitespace.eos');

rule('statement.break')
  .match(
    ':keyword.break',
    ':whitespace.eos')
  .match(
    ':keyword.break',
    ':whitespace.simple',
    ':identifier',
    ':whitespace.eos');

rule('statement.return')
  .match(
    ':keyword.return',
    ':whitespace.eos')
  .match(
    ':keyword.return',
    ':whitespace.simple',
    ':expression',
    ':whitespace.eos');

rule('statement.with')
  .match(
    ':keyword.with',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':expression',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':statement');

rule('statement.switch')
  .match(
    ':keyword.switch',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':discriminant.expression',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':case.block');

rule('case.block')
  .match(
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':case.clause.set?',
    ':punctuation.bracket.square.end')
  .match(
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':case.clause.set?',
    ':case.clause.default',
    ':whitespace.multiline',
    ':case.clause.set?',
    ':punctuation.bracket.square.end');

rule('case.clause.set')
  .match(
    ':case.clause',
    ':case.clause.set.end*',
    ':whitespace.multiline');

rule('case.clause.set.end')
  .match(
    ':whitespace.multiline',
    ':case.clause');

rule('case.clause')
  .match(
    ':keyword.case',
    ':whitespace.multiline',
    ':expression',
    ':whitespace.multiline',
    ':punctuation.colon',
    ':case.clause.end?');

rule('case.clause.default')
  .match(
    ':keyword.default',
    ':whitespace.multiline',
    ':punctuation.colon',
    ':case.clause.end?');

rule('case.clause.end')
  .match(
    ':whitespace.multiline',
    ':statement.list');

rule('statement.labelled')
  .match(
    ':identifier',
    ':whitespace.multiline',
    ':punctuation.colon',
    ':whitespace.multiline',
    ':statement');

rule('statement.throw')
  .match(
    ':keyword.throw',
    ':whitespace.simple',
    ':expression',
    ':whitespace.eos');

rule('statement.try')
  .match(
    ':keyword.try',
    ':whitespace.multiline',
    ':block',
    ':whitespace.multiline',
    ':catch',
    ':whitespace.multiline',
    ':finally')
  .match(
    ':keyword.try',
    ':whitespace.multiline',
    ':block',
    ':whitespace.multiline',
    ':catch')
  .match(
    ':keyword.try',
    ':whitespace.multiline',
    ':block',
    ':whitespace.multiline',
    ':finally')

rule('catch')
  .match(
    ':keyword.catch',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':identifier',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':block');

rule('finally')
  .match(
    ':keyword.finally',
    ':whitespace.multiline',
    ':block');

rule('statement.debugger')
  .match(
    ':keyword.debugger',
    ':whitespace.eos');

rule('declaration.function')
  .match(
    ':keyword.function',
    ':whitespace.multiline',
    ':identifier',
    ':whitespace.multiline',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':list.formal-parameter.whitespace?',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':function.body',
    ':whitespace.multiline',
    ':punctuation.bracket.square.end');

rule('expression.function')
  .match(
    ':keyword.function',
    ':whitespace.multiline',
    ':identifier.whitespace?',
    ':punctuation.bracket.parenthesis.begin',
    ':whitespace.multiline',
    ':list.formal-parameter.whitespace?',
    ':punctuation.bracket.parenthesis.end',
    ':whitespace.multiline',
    ':punctuation.bracket.square.begin',
    ':whitespace.multiline',
    ':function.body',
    ':whitespace.multiline',
    ':punctuation.bracket.square.end');

rule('list.formal-parameter.whitespace')
  .match(
    ':list.formal-parameter',
    ':whitespace.multiline');

rule('list.formal-parameter')
  .match(
    ':identifier',
    ':list.formal-parameter.end*');

rule('list.formal-parameter.end')
  .match(
    ':whitespace.multiline',
    ':punctuation.comma',
    ':whitespace.multiline',
    ':identifier');

rule('function.body')
  .match(
    ':source-elements?');

rule('program')
  .match(
    ':source-elements?');

rule('source-elements')
  .match(
    ':source-element',
    ':source-elements.end*');

rule('source-elements.end')
  .match(
    ':whitespace.multiline',
    ':source-element');

rule('source-element')
  .match(
    ':statement')
  .match(
    ':declaration.function');

/**
 * Separator / Space
 */

rule('punctuation.separator')
  .match(/[\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/, value);

/**
 * Line terminator.
 */

rule('whitespace.line.terminator')
  .match(/[\n\r\u2028\u2029]/, value);

/**
 * Line terminator sequence.
 */

rule('whitespace.line.terminator-sequence')
  .match(
    '\n', value)
  .match(
    '\r\n', value)
  .match(
    '\r', value)
  .match(
    '\u2028', value)
  .match(
    '\u2029', value);

rule('punctuation.backslash')
  .match("\\", value);

rule('operator.lt')
  .match('<');

rule('operator.gt')
  .match('>');

operator('modulus', '%');

/**
 * Define keyword rule.
 *
 * @param {String} name
 * @api private
 */

function keyword(name) {
  rule('keyword').match(':' + name);
  return rule('keyword.' + name).match(name, '!:identifier.part', value);
}

function operator(name, symbol) {
  return rule('operator.' + name).match(symbol, value);
}

function punc(name, symbol) {
  return rule('punctuation.' + name).match(symbol, value);
}

function log() {
  console.log(JSON.stringify(arguments));
}