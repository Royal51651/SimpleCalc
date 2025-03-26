#[tauri::command]
fn calculate(equation: String) -> String {
    let tokens: Vec<Token> = tokenize(equation);
    let mut parsed: Vec<Token> = parse(tokens);
    // parse and cast the first number to startd the process
    let mut result: f64 = 0.0;
    let mut operator: String = String::from("+");
    while !parsed.is_empty() {
        // iterates through tokens from left to right
        let token = parsed.remove(0);
        if token.token_type == "operator" {
            operator = token.value;
        } else {
            let number: f64 = token.value.parse::<f64>().unwrap();
            if number == 0.0 && (operator == "/" || operator == "%") {
                return "Error :(".to_string();
            }
            result = match operator.as_str() {
                "+" => result + number,
                "-" => result - number,
                "*" => result * number,
                "/" => result / number,
                "%" => result % number,
                _ => panic!("Unexpected operator"),
            };
        }
    }

    format!("{}", result.to_string())
}

#[derive(Clone, Debug)]
struct Token {
    token_type: String,
    value: String,
}

fn parse(tokens: Vec<Token>) -> Vec<Token> {
    let mut output: Vec<Token> = Vec::new();
    let mut negative: bool = false;
    let mut last_operator: String = String::from("+");
    for i in tokens {
        if i.value == "-" {
            if last_operator == "-" {
                // two negatives equals a positive
                let token = Token {
                    token_type: String::from("operator"),
                    value: String::from("+"),
                };
                output.push(token);
                last_operator = "+".to_string();
                negative = false;
            } else {
                let token = Token {
                    token_type: String::from("operator"),
                    value: last_operator.clone(),
                };
                output.push(token);
                last_operator = i.value;
                negative = true;
            }
        } else if i.token_type == "operator" {
            last_operator = i.value.clone();
            output.push(i);
        } else {
            if negative {
                let val = format!("-{}", i.value);
                let token = Token {
                    token_type: String::from("number"),
                    value: val,
                };
                output.push(token);
                negative = false;
            } else {
                output.push(i);
            }
        }
        
    }
    output
}

// breaks equation into smaller string tokens 
fn tokenize(input: String) -> Vec<Token> {
    let mut tokens: Vec<Token> = Vec::new();
    let mut current_token: String = String::new();

    for c in input.chars() { 
        if c == '+' || c == '-' || c == '*' || c == '/' || c == '%' {
            if !current_token.is_empty() {
                let token = Token {
                    token_type: String::from("number"),
                    // clone here because we want the token to have ownership of the data
                    value: current_token.clone(),
                };
                tokens.push(token);
                current_token.clear();
            }
            let token = Token {
                token_type: String::from("operator"),
                value: c.to_string(),
            };
            tokens.push(token);
        } else {
            // in normal scenarios, input will be limited to numbers and operations, so no further input-checking is needed
            current_token.push(c);
        }
    }
    
    if !current_token.is_empty() {
        let token = Token {
            token_type: String::from("num"),
            value: current_token,
        };
        tokens.push(token);
    }

    tokens
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![calculate])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
