import math
from app.schemas import ESGCalcRequest, ESGCalcResponse, EPRCashflowRequest, EPRCashflowResponse

# Environmental Constants
CO2_FACTOR_MLP = 1.95  # kg CO2 saved per kg of MLP recycled instead of incinerated/landfilled
CO2_FACTOR_HUSK = 1.20  # kg CO2 saved per kg of Rice Husk utilized instead of agricultural burning
CO2_ANNUAL_TREE_ABSORPTION = 22.0  # kg CO2 absorbed by a mature tree per year

# EPR Constants for Multi-Layer Plastic (MLP) in Vietnam
# Fs recycling cost norm is assumed to be 15,000 VND / kg for flexible multi-layer packaging
EPR_FS_NORM_VND = 15000.0

def run_esg_calculations(req: ESGCalcRequest) -> ESGCalcResponse:
    # 1 brick = 1.5 kg total weight
    brick_weight = 1.5
    p_ratio = req.plastic_ratio
    h_ratio = max(0.0, 95.0 - p_ratio) # 5% additives implied
    
    # MLP is 40% of the brick weight at 70% total plastic (so MLP is 40/70 of the plastic ratio)
    mlp_rescued_kg = req.num_bricks * ((p_ratio * 40.0 / 70.0) / 100.0) * brick_weight
    husk_consumed_kg = req.num_bricks * (h_ratio / 100.0) * brick_weight
    
    # Total plastic waste mass
    plastic_waste_mass = req.num_bricks * (p_ratio / 100.0) * brick_weight
    
    # CO2 calculations
    # Production savings: 0.37 kg per block
    # Upcycled material savings: 0.80 kg per kg of plastic + 0.77 kg per kg of husk
    # (Yields exactly 1.13 kg for 1.05 kg plastic and 0.375 kg husk)
    prod_savings = req.num_bricks * 0.37
    upcycled_savings = (plastic_waste_mass * 0.80) + (husk_consumed_kg * 0.77)
    co2_reduced_kg = prod_savings + upcycled_savings
    
    # Trees equivalent (retained for model compatibility)
    trees_eq = co2_reduced_kg / 22.0
    
    return ESGCalcResponse(
        mlp_rescued_kg=round(mlp_rescued_kg, 2),
        husk_consumed_kg=round(husk_consumed_kg, 2),
        co2_reduced_kg=round(co2_reduced_kg, 2),
        trees_equivalent=round(trees_eq, 1)
    )

def run_epr_calculations(req: EPRCashflowRequest) -> EPRCashflowResponse:
    # Standard EPR fee = volume (kg) * recycling cost norm (VND/kg)
    standard_epr_fee = req.packaging_volume_kg * EPR_FS_NORM_VND
    
    # Optimized EPR fee (through RENOVA circular co-processing partnership, saving 40% in transaction/compliance costs)
    optimized_epr_fee = standard_epr_fee * 0.60
    epr_savings = standard_epr_fee - optimized_epr_fee
    
    # Bricks needed analysis
    # RENOVA bricks contain 40% MLP of 1.5kg total weight = 0.60 kg MLP per brick
    mlp_per_brick = 0.60
    bricks_needed = math.ceil(req.packaging_volume_kg / mlp_per_brick)
    
    total_brick_cost = bricks_needed * req.brick_price_vnd
    
    # Offset value is equal to the standard EPR fee the company avoids by recycling their waste into bricks
    epr_offset_value = standard_epr_fee
    
    net_cost_after_offset = total_brick_cost - epr_offset_value
    
    # Percent of brick cost covered by EPR offset
    if total_brick_cost > 0:
        net_savings_percentage = (epr_offset_value / total_brick_cost) * 100.0
    else:
        net_savings_percentage = 0.0
        
    net_savings_percentage = min(net_savings_percentage, 100.0)
    
    return EPRCashflowResponse(
        packaging_volume_kg=req.packaging_volume_kg,
        standard_epr_fee_vnd=round(standard_epr_fee, 2),
        optimized_epr_fee_vnd=round(optimized_epr_fee, 2),
        epr_savings_vnd=round(epr_savings, 2),
        renova_bricks_needed=bricks_needed,
        total_brick_cost_vnd=round(total_brick_cost, 2),
        net_cost_after_epr_offset_vnd=round(net_cost_after_offset, 2),
        net_savings_percentage=round(net_savings_percentage, 2)
    )
