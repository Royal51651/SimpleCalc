#[tauri::command]
fn calculate(expr: String) -> String {
    let mut tokens: Vec<String> = tokenize(expr);
    // parse and cast the first number to startd the process
    let mut result: f64 = tokens.remove(0).parse::<f64>().unwrap();

    while !tokens.is_empty() {
        // iterates through tokens from left to right
        // we dont realllly have to care about PEMDAS as the calculations aren't the main focus
        let operator: String = tokens.remove(0);
        let next_operand: f64 = tokens.remove(0).parse::<f64>().unwrap();
        result = match operator.as_str() {
            "+" => result + next_operand,
            "-" => result - next_operand,
            "*" => result * next_operand,
            "/" => result / next_operand,
            _ => panic!("Unexpected operator"),
        };
    }

    format!("{}", result.to_string())
}

// breaks equation into smaller string tokens 
fn tokenize(expr: String) -> Vec<String> {
    let mut tokens: Vec<String> = Vec::new();
    let mut current_token: String = String::new();

    for c in expr.chars() {
        if c == '+' || c == '-' || c == '*' || c == '/' {
            if !current_token.is_empty() {
                tokens.push(current_token.clone());
                current_token.clear();
            }
            tokens.push(c.to_string());
        } else {
            // in normal scenarios, input will be limited to numbers and operations, so no further input-checking is needed
            current_token.push(c);
        }
    }
    if !current_token.is_empty() {
        tokens.push(current_token);
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
