This program generates by default 100 armies with a size of 200 units and 4 unit types (Archers, Horsemen, Swordsmen, Spearsmen) and a split bias of 0.15.
You will see by a simple look at the code that you can add any new units easily if needed.
The bias is a float number in the range of [0,1] that represents how much the army will be split into different troops. The lower the value is, the less troops there is.

The output is a readable JSON file with the armies and their troops.

------------
To run use a command like this: 
`java -cp ArmyGeneration.jar Main {armySize} {splitBias} {seed}`
-- arguments in-between `{}` are optional and `{}` are not part of the arguments syntax.


------------
There is no dependencies other than default Java utilities. I made that choice to make the program straightforward and easy to apprehend and also because this problem didn't really require any advanced tools to be solved.
Although using a library for a new random number generator could be a good idea, it wouldn't change really the implementation at the end.

------------
I used Java for this solution and so I used the Object Oriented Programming paradigm.
The code consists in 3 classes:
    - ArmyFactory: this class is here to setup the generation of the armies and returns armies on demand
    - Army: this class is the army itself, it a simple class containing its size and unit types as well as the troops it contains
    - Troop: this is the troop class, a very simple class defined by its size and its unit type

------------
There is also a small webapp called "Army dataset explorer" allowing you to upload the "output.json" and preview the armies inside the dataset.
It is just a quick app I made to help preview the generated data. It doesn't take even an hour to make and I think it helps a lot to visualize results.