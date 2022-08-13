public class Troop {
    private int size;
    private String unit;

    /**
     * @param unit A string representing the unit type corresponding to this troop.
     * @param size The size of this troop.
     */
    public Troop(String unit, int size) {
        this.size = size;
        this.unit = unit;
    }

    public int getSize() {
        return this.size;
    }

    public String getUnit() {
        return this.unit;
    }

    public String toString() {
        return "{\"" + this.unit + "\":" + this.size + "}";
    }
}