
const { Game,} = require('./src/script')

    describe('Game class, creates 2 players, setPlayer toggles players, isHit matches coords to other players occupied coords', () => {
        const testGame = new Game()
        test('player2 exists is named, and has 5 ships', () => {
            expect(testGame.player2.name).toBe('player2')
            expect(testGame.player2.ships.length).toBe(5)
        })
        test('setPlayer initializes game to player1 then toggles between players', () => {            
            expect(testGame.setPlayer()).toBe(testGame.currentPlayer)
            expect(testGame.currentPlayer).toBe(testGame.player1)
            expect(testGame.setPlayer()).not.toBe(testGame.otherPlayer)
            expect(testGame.currentPlayer).toBe(testGame.player2)
        })
   
        describe('Player class has a name, 2 grids, and a fleet of ships', () => {
            const testPlayer = testGame.player1
            test(`test player name: ${testPlayer.name}`, () => {
                expect(testPlayer.name).toBe('player1')
            })
          
            describe('the Ship class keeps track of hits, sets isSunk', () => {
                const carrier = testPlayer.ships[0]
                test('decrease hit count until ship is sunk', () => {
                    expect(carrier.isSunk).toBeFalsy()
                    expect(carrier.hit()).toBe(4)
                    expect(carrier.hit()).toBe(3)
                    expect(carrier.hit()).toBe(2)
                    expect(carrier.hit()).toBe(1)
                    expect(carrier.hit()).toBe(0)
                    expect(carrier.isSunk).toBeTruthy()
                })
            })
            describe('validates coordinates and pushes to ship array, invalid coordinates adjust and retry', () => {
             
                test('horizontal location tree', () => {
                expect(testGame.setLocation(testPlayer, 0, 45)).toStrictEqual([43, 44, 45, 46, 47])
                expect(testGame.setLocation(testPlayer, 0, 45 )).toStrictEqual([43, 44, 45, 46, 47])
                expect(testGame.setLocation(testPlayer, 1, 45 )).toStrictEqual([ 44, 45, 46, 47])
               
                //invalid coord
                // expect(testGame.setLocation(testPlayer, 1, 0)).toStrictEqual([ 0, 1, 2, 3])
                // expect(testGame.setLocation(testPlayer, 1, 9)).toStrictEqual([ 6, 7, 8, 9])
                expect(testGame.shipLocation(testPlayer, 0, 45)).toStrictEqual([43, 44, 45, 46, 47])
            })
            test('linkCells', () => {
                expect(testGame.linkCells(45)).toEqual({"cell": 45, "nextHorizontal": 46, "nextVertical": 55, "prevHorizontal": 44, "prevVertical": 35}
                )
            })

              test('vertical location tree', () => {
                testPlayer.switchOrientation(0)
                expect(testGame.setLocation(testPlayer, 0, 45)).toStrictEqual([25, 35, 45, 55, 65])
                testPlayer.switchOrientation(1)
                expect(testGame.setLocation(testPlayer, 1, 45 )).toStrictEqual([ 35, 45, 55, 65])
              })
                
            })
        }) 
        describe('10 x 10 grid, where every square has coordinates and a grid index', () => {
            const testGrid = testGame.p1Board
            test('checks for a grid length of 100', () => {
                expect(testGrid.grid.length).toBe(100)
            })
         
            test('findCoords returns the grid coordinates from an index', () => {
                expect(testGrid.findCoords(0)).toBe(testGrid.grid[0])
                expect(testGrid.findCoords(9)).toBe(testGrid.grid[9])
                expect(testGrid.findCoords(19)).toBe(testGrid.grid[19])
            })
            test('isValid', () => {
                expect(testGrid.isValid(45)).toBeTruthy()
                expect(testGrid.isValid(0)).toBeTruthy()
                expect(testGrid.isValid(100)).toBeFalsy()
                expect(testGrid.isValid(-1)).toBeFalsy()
                
            })
            // test('set player should set player 1 to initialize then toggle players')
           
            
        })
    })


