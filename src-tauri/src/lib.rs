// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn calculate(expr: &str) -> String {
    let mut tokens = tokenize(expr);
    let mut result = tokens.remove(0).parse::<i64>().unwrap(); // Get the first number

    while !tokens.is_empty() {
        let operator = tokens.remove(0);
        let next_operand = tokens.remove(0).parse::<i64>().unwrap();

        // Evaluate left to right without considering operator precedence
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

fn tokenize(expr: &str) -> Vec<String> {
    let mut tokens = Vec::new();
    let mut current_token = String::new();

    for c in expr.chars() {
        if c.is_digit(10) {
            current_token.push(c);
        } else if c == '+' || c == '-' || c == '*' || c == '/' {
            if !current_token.is_empty() {
                tokens.push(current_token.clone());
                current_token.clear();
            }
            tokens.push(c.to_string());
        } else {
            panic!("Invalid character in expression");
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
