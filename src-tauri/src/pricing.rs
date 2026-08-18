use crate::error::Result;
use crate::config::AppSettings;
use std::collections::HashMap;

pub struct PricingCalculator;

// Default pricing rates (in USD per 1M tokens)
const DEFAULT_RATES: &[(&str, &str, f64, f64)] = &[
    // (provider, model, input_rate, output_rate)
    ("anthropic", "claude-opus", 15.0, 75.0),
    ("anthropic", "claude-sonnet", 3.0, 15.0),
    ("anthropic", "claude-haiku", 0.8, 4.0),
    ("openai", "gpt-4", 30.0, 60.0),
    ("openai", "gpt-4-turbo", 10.0, 30.0),
    ("openai", "gpt-4o", 5.0, 15.0),
    ("openai", "gpt-4o-mini", 0.15, 0.6),
    ("google", "gemini-pro", 0.5, 1.5),
];

impl PricingCalculator {
    /// Calculate cost for a session given the model and token counts
    pub fn calculate_cost(
        provider: &str,
        model: &str,
        input_tokens: i64,
        output_tokens: i64,
        overrides: &HashMap<String, f64>,
    ) -> f64 {
        // Check for override first
        let model_key = format!("{}/{}", provider, model);
        if let Some(&cost) = overrides.get(&model_key) {
            return cost;
        }

        // Find matching rate from defaults
        if let Some(&(_, _, input_rate, output_rate)) =
            DEFAULT_RATES.iter().find(|(p, m, _, _)| p == &provider && m == &model)
        {
            let input_cost = (input_tokens as f64 / 1_000_000.0) * input_rate;
            let output_cost = (output_tokens as f64 / 1_000_000.0) * output_rate;
            input_cost + output_cost
        } else {
            // Unknown model: estimate at 10 USD per million tokens average
            let total_tokens = (input_tokens + output_tokens) as f64;
            (total_tokens / 1_000_000.0) * 10.0
        }
    }

    pub fn get_model_rate(provider: &str, model: &str) -> Option<(f64, f64)> {
        DEFAULT_RATES
            .iter()
            .find(|(p, m, _, _)| p == &provider && m == &model)
            .map(|(_, _, input_rate, output_rate)| (*input_rate, *output_rate))
    }

    pub fn list_models() -> Vec<(String, String)> {
        DEFAULT_RATES
            .iter()
            .map(|(p, m, _, _)| (p.to_string(), m.to_string()))
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_cost_known_model() {
        let cost = PricingCalculator::calculate_cost(
            "anthropic",
            "claude-opus",
            1_000_000, // 1M input tokens
            500_000,   // 500k output tokens
            &HashMap::new(),
        );

        // 1M * 15 + 0.5M * 75 = 15 + 37.5 = 52.5
        assert!((cost - 52.5).abs() < 0.01);
    }

    #[test]
    fn test_calculate_cost_unknown_model() {
        let cost = PricingCalculator::calculate_cost(
            "unknown_provider",
            "unknown_model",
            1_000_000,
            1_000_000,
            &HashMap::new(),
        );

        // Fallback: 2M tokens * 10 / 1M = 20
        assert!((cost - 20.0).abs() < 0.01);
    }

    #[test]
    fn test_calculate_cost_with_override() {
        let mut overrides = HashMap::new();
        overrides.insert("anthropic/claude-opus".to_string(), 1.0);

        let cost = PricingCalculator::calculate_cost(
            "anthropic",
            "claude-opus",
            1_000_000,
            500_000,
            &overrides,
        );

        assert_eq!(cost, 1.0);
    }

    #[test]
    fn test_list_models() {
        let models = PricingCalculator::list_models();
        assert!(!models.is_empty());
        assert!(models.iter().any(|(p, m)| p == "anthropic" && m == "claude-opus"));
    }
}
