"""
risk_analyzer.py

Enhanced Asset Risk Analysis with configurable sensitivity settings
"""

import math
from typing import Dict, Any


class AssetRiskAnalyzer:
    """
    AssetRiskAnalyzer provides a set of methods to evaluate risk and stability
    of a given asset based on multiple market factors.
    """

    def __init__(self,
                 volatility_weight: float = 1.2,
                 stability_weight: float = 1.0,
                 momentum_weight: float = 1.1,
                 liquidity_weight: float = 0.8,
                 forecast_threshold: float = 0.8,
                 long_term_threshold: float = 2.0):
        """
        Initialize the analyzer with customizable weights and thresholds.

        :param volatility_weight: Multiplier for volatility impact
        :param stability_weight: Multiplier for stability factor
        :param momentum_weight: Multiplier for market momentum
        :param liquidity_weight: Multiplier for liquidity factor
        :param forecast_threshold: Threshold above which instability is flagged
        :param long_term_threshold: Threshold above which long-term instability is flagged
        """
        self.volatility_weight = volatility_weight
        self.stability_weight = stability_weight
        self.momentum_weight = momentum_weight
        self.liquidity_weight = liquidity_weight
        self.forecast_threshold = forecast_threshold
        self.long_term_threshold = long_term_threshold

    def risk_minder(self, asset_data: Dict[str, Any]) -> str:
        """
        Assess short-term risk of instability.

        :param asset_data: Dictionary containing asset metrics:
            - priceVolatility: float
            - marketMomentum: float
            - stabilityScore: float
            - marketRisk: float
        :return: Alert string indicating risk status
        """
        volatility_impact = (
            math.log(asset_data['priceVolatility'] + 1)
            * asset_data['marketMomentum']
            * self.volatility_weight
            * self.momentum_weight
        )
        stability_factor = (
            (asset_data['stabilityScore'] / max(asset_data['marketRisk'], 1e-6))
            * self.stability_weight
        )
        forecast_risk = volatility_impact * stability_factor

        if forecast_risk > self.forecast_threshold:
            return "Alert: Risk of Instability Forecasted"
        return "Asset Stability Likely"

    def long_term_guard(self, asset_data: Dict[str, Any]) -> str:
        """
        Assess long-term risk based on price and volatility.

        :param asset_data: Dictionary containing asset metrics:
            - price: float
            - marketMomentum: float
            - volatility: float
        :return: Alert string indicating long-term risk status
        """
        liquidity_factor = (
            (1.0 / math.sqrt(max(asset_data['volatility'], 1e-6)))
            * self.liquidity_weight
        )
        long_term_risk = (
            asset_data['price']
            * asset_data['marketMomentum']
            * liquidity_factor
        )

        if long_term_risk > self.long_term_threshold:
            return "Alert: Long-Term Instability Predicted"
        return "Long-Term Stability Assured"

    def combined_risk(self, asset_data: Dict[str, Any]) -> str:
        """
        Provide a combined risk overview by evaluating both short-term
        and long-term perspectives.
        """
        short_term = self.risk_minder(asset_data)
        long_term = self.long_term_guard(asset_data)
        return f"{short_term}; {long_term}"


if __name__ == "__main__":
    sample_data = {
        "priceVolatility": 0.15,
        "marketMomentum": 0.9,
        "stabilityScore": 75,
        "marketRisk": 50,
        "price": 100.0,
        "volatility": 0.2
    }
    analyzer = AssetRiskAnalyzer()
    print(analyzer.combined_risk(sample_data))
