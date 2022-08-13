import java.util.Set;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        /* Using a Set to ensure uniqueness between elements */
        Set<String> ArmyUnits = new HashSet<String>();
        ArmyUnits.add("Archers");
        ArmyUnits.add("Swordsmen");
        ArmyUnits.add("Spearmen");
        ArmyUnits.add("Horsemen");

        ArmyFactory ArmyFactory;
        switch (args.length) {
            case 1:
                ArmyFactory = new ArmyFactory(Integer.parseInt(args[0]), ArmyUnits);
                break;
            case 2:
                ArmyFactory = new ArmyFactory(Integer.parseInt(args[0]), ArmyUnits, Double.parseDouble(args[1]));
                break;
            case 3:
                ArmyFactory = new ArmyFactory(Integer.parseInt(args[0]), ArmyUnits, Double.parseDouble(args[1]), Long.parseLong(args[2]));
                break;
            default:
                ArmyFactory = new ArmyFactory(200, ArmyUnits);
                break;
        }
        
        System.out.println(ArmyFactory.getGenerationDetails());

        /* output.json */
        int armyCount = 100;
        try {
            FileWriter file = new FileWriter("./output.json");
            file.write('{');
            for (int i = 0; i < armyCount; i++) {
                if (i > 0) {
                    file.write(",\n");
                }
                file.write("\"army" + i + "\":" + ArmyFactory.createArmy().getTroops().toString());
            }
            file.write('}');
            file.close();
            System.out.println("'output.json' has been generated with " + armyCount + " armies in random configurations.");
         } catch (IOException e) {
            e.printStackTrace();
         }
    }
}
