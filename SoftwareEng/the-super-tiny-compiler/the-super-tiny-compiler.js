'use strict';

// tokenizer for lexical analysis (source code - tokens)
function tokenizer(input) {
    let current = 0;
    let tokens = [];

    while (current < input.length) {
        let char = input[current];

        // parentheses
        if (char === '(') {
            tokens.push({
                type: 'paren',
                value: '('
            });
            current++;
            continue;
        }

        if (char === ')') {
            tokens.push({
                type: 'paren',
                value: ')',
            });
            current++;
            continue;
        }

        // whitespace
        let WHITESPACE = /\s/;
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }

        // number
        let NUMBERS = /[0-9]/;
        if (NUMBERS.test(char)) {
            let value = '';
            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current];
            }
            tokens.push({ type: 'number', value });
            continue;
        }

        // double quoted string
        if (char === '"') {
            let value = '';
            char = input[++current];
            while (char !== '"') {
                value += char;
                char = input[++current];
            }
            char = input[++current];
            tokens.push({ type: 'string', value });
            continue;
        }

        // function name
        let LETTERS = /[a-z]/i;
        if (LETTERS.test(char)) {
            let value = '';
            while (LETTERS.test(char)) {
                value += char;
                char = input[++current];
            }
            tokens.push({ type: 'name', value });
            continue;
        }

        // otherwise throw error
        throw new TypeError('Tokenizer: unknown character: ' + char);
    }

    return tokens;
}

// parser for syntactic analysis (tokens - AST)
function parser(tokens) {
    let current = 0;

    // recursive call to parse the token list
    function walk() {
        let token = tokens[current];
        if (token.type === 'number') {
            current++;
            return {
                type: 'NumberLiteral',
                value: token.value,
            };
        }

        if (token.type === 'string') {
            current++;
            return {
                type: 'StringLiteral',
                value: token.value,
            };
        }

        if (
            token.type === 'paren' && 
            token.value === '('
        ) {
            token = tokens[++current];
            let node = {
                type: 'CallExpression',
                name: token.value,
                params: [],
            }
            token = tokens[++current];
            while (
                (token.type !== 'paren') || 
                (token.type === 'paren' && token.value !== ')')
            ) {
                node.params.push(walk());
                token = tokens[current];
            }
            current++;
            return node;
        }
        throw new TypeError(token.type);
    }

    let ast = {
        type: 'Program',
        body: [],
    };

    while (current < tokens.length) {
        ast.body.push(walk());
    }
    return ast;
}

// traverser to visit nodes in AST
function traverser(ast, visitor) {
    function traverseArray(array, parent) {
        array.forEach(child => {
            traverseNode(child, parent);
        });
    }

    function traverseNode(node, parent) {
        let methods = visitor[node.type];

        if (methods && methods.enter) {
            methods.enter(node, parent);
        }

        switch (node.type) {
            case 'Program':
                traverseArray(node.body, node);
                break;
            
            case 'CallExpression':
                traverseArray(node.params, node);
                break;

            case 'NumberLiteral':
            case 'StringLiteral':
                break;
            
            default:
                throw new TypeError(node.type);
        }

        if (methods && methods.exit) {
            methods.exit(node, parent);
        }
    }

    traverseNode(ast, null);
}

// transformer to create a new C-like AST
function transformer(ast) {
    let newAst = {
        type: 'Program',
        body: [],
    }

    ast._context = newAst.body; // reference from old ast to new ast

    traverser(ast, {
        NumberLiteral: {
            enter(node, parent) {
                parent._context.push({
                    type: 'NumberLiteral',
                    value: node.value,
                });
            },
        },

        StringLiteral: {
            enter(node, parent) {
                parent._context.push({
                    type: 'StringLiteral',
                    value: node.value,
                });
            },
        },

        CallExpression: {
            enter(node, parent) {
                let expression = {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: node.name,
                    },
                    arguments: [],
                };

                node._context = expression.arguments;

                if (parent.type !== 'CallExpression') {
                    expression = {
                        type: 'ExpressionStatement',
                        expression: expression,
                    };
                }

                parent._context.push(expression);
            },
        }
    });

    return newAst;
}

// code generator to string-ify the AST
function codeGenerator(node) {
    switch (node.type) {
        case 'Program':
            return node.body.map(codeGenerator).join('\n');
        
        case 'ExpressionStatement':
            return (
                codeGenerator(node.expression) + ';'
            ) ;
        
        case 'CallExpression':
            return (
                codeGenerator(node.callee) + '(' + 
                node.arguments.map(codeGenerator)
                .join(', ') + ')'
            );
        
        case 'Identifier':
            return node.name;
        
        case 'NumberLiteral':
            return node.value;
        
        case 'StringLiteral':
            return '"' + node.value + '"';
        
        default:
            throw new TypeError(node.type);
    }
}

function compiler(input) {
    let tokens = tokenizer(input);
    let ast    = parser(tokens);
    let newAst = transformer(ast);
    let output = codeGenerator(newAst);

    return output;
}

module.exports = {
    tokenizer,
    parser,
    traverser,
    transformer,
    codeGenerator,
    compiler,
  };