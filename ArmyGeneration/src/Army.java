import java.util.Set;
import java.util.ArrayList;

public class Army {
    private int size;
    private Set<String> units;
    private ArrayList<Troop> troops;

    /**
     * @param units A set of String representing each unit type in the army.
     * @param size The total size of the army
     * @param troops A list of Troop objects containing each troop unit type and size.
     */
    public Army(Set<String> units, int size, ArrayList<Troop> troops) {
        this.size = size;
        this.units = units;
        this.troops = troops;
    }

    public int getSize() {
        return this.size;
    }

    public Set<String> getUnits() {
        return this.units;
    }

    public ArrayList<Troop> getTroops() {
        return this.troops;
    }

    public String toString() {
        return "{\"size\":" + this.size + ",\"units\":" + this.units + ",\"troops\":" + this.getTroops().toString() + "}";
    }
}