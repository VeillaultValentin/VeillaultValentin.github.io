import java.util.Set;
import java.util.Random;
import java.util.ArrayList;

public class ArmyFactory {
    private int size;
    private Set<String> units;
    private Long seed;
    private Random Rng;
    private double splitBias;

    /**
     * @param size The size of the army.
     * @param units A set of String representing unit types.
     */
    public ArmyFactory(int size, Set<String> units) {
        if (size <= 0) {
            throw new IllegalArgumentException("Army size must be positive and non null");
        }
        this.size = size;
        this.units = units;
        this.Rng = new Random();
        this.splitBias = 0.15;
    }

    /**
     * @param size The size of the army.
     * @param units A set of String representing unit types.
     * @param splitBias A double in the range of [0,1] representing how much the army will be split into different troops.
     */
    public ArmyFactory(int size, Set<String> units, double splitBias) {
        this(size, units);
        if (splitBias < 0 || splitBias > 1) {
            throw new IllegalArgumentException("Split bias must be a double in the range of [0,1]");
        }
        this.splitBias = splitBias;
    }

    /**
     * @param size The size of the army.
     * @param units A set of String representing unit types.
     * @param splitBias A double in the range of [0,1] representing how much the army will be split into different troops.
     * @param seed The random number generator seed.
     */
    public ArmyFactory(int size, Set<String> units, double splitBias, Long seed) {
        this(size, units, splitBias);
        this.seed = seed;
        this.Rng.setSeed(seed);
    }

    public int getSize() {
        return this.size;
    }

    public Set<String> getUnits() {
        return this.units;
    }

    /** 
     * {@summary} Army Creation.
     * @return An Army object containing Troop objects and reprenting the army configuration.
    */
    public Army createArmy() {
        int troopsAmount = this.splitTroops();
        int[] troopSize = this.getTroopsSizes(troopsAmount);
        String[] unitsNames = this.units.toArray(new String[0]);
        ArrayList<Troop> Troops = new ArrayList<Troop>();

        for (int i = 0; i < troopsAmount; i++) {
            Troops.add(new Troop(unitsNames[this.Rng.nextInt(this.units.size())], troopSize[i]));
        }

        return new Army(this.units, this.size, Troops);
    }

    /**
     * {@summary} Retreives the factory parameters generating the armies.
     * @return A string containing the informations.
     */
    public String getGenerationDetails() {
        return "{\"generation\":{\"size\":" + this.size + ",\"units\": " + this.units + ",\"splitBias:\"" + this.splitBias + ",\"seed:\"" + this.seed + "}}";
    }

    /**
     *  Gets a random amount of troops to split the army
     */
    private int splitTroops() {
        int bound = (int)(this.size * this.splitBias);
        if (bound <= 0) {
            return 1;
        } else {
            return this.Rng.nextInt(bound - 1) + 1;
        }
    }

    /** Troops sizes
     * {@summary} This is the main distribution algorithm and so where you'd like to update the RNG quality if needed
     * @param troopAmount The amount of troops in the army.
     * @return An array containing the amount of units in each troops.
     */
    private int[] getTroopsSizes(int troopAmount) {
        int[] troopSizes = new int[troopAmount];

        // minimum troop size is set to 50% of the expected average troop size
        int min = (int)(this.size / troopAmount * 0.5);
        int totalCheck = 0;

        for (int i = 0; i < troopAmount; i++) {
            int quantity = this.Rng.nextInt((int)(this.size / troopAmount) - min) + min;
            troopSizes[i] = quantity;
            totalCheck += quantity;
        }

        /* makes sure every unit finds a troop */
        if (totalCheck < this.size) {
            int remainingUnits = this.size - totalCheck;
            while (remainingUnits > 0) {
                for (int i = 0; i < troopAmount; i++) {
                    if (remainingUnits > 0) {
                        troopSizes[i]++;
                        remainingUnits--;
                    } else {
                        // if all units found a troop, it's not needed to wait until the end of the loop, and so, here we skip it to save so time especially on bigger armies
                        return troopSizes;
                    }
                }
            }
        }
        return troopSizes;
    }
}
