
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
                expect(testGame.setShipLocation(testPlayer, 0, '45' )).toStrictEqual(['43', '44', '45', '46', '47'])
              })
              test('horizontal with invalid coordinates', () => {
                // expect(testGame.setShipLocation(testPlayer, 2, '00' )).toStrictEqual(['00', '01', '02', '03'])
                expect(testGame.setShipLocation(testPlayer, 1, '00' )).toStrictEqual(['00', '01', '02', '03'])
                expect(testGame.setShipLocation(testPlayer, 1, '09' )).toStrictEqual(['06', '07', '08', '09'])
              })
            test('adjust row or column increments by +1 for less than 4 or -1 for greater than 4', () => {
                expect(testGame.adjustRowOrColumn(3)).toBe(4)
                expect(testGame.adjustRowOrColumn(5)).toBe(4)
                expect(testGame.adjustRowOrColumn(4)).toBe(5)
            })
              test('vertical location tree', () => {
                testPlayer.switchOrientation(0)
                expect(testGame.setShipLocation(testPlayer, 0, '45')).toStrictEqual(['25', '35', '45', '55', '65'])
              })
                
            })
        }) 
        describe('10 x 10 grid, where every square has coordinates and a grid index', () => {
            const testGrid = testGame.p1Board
            test('checks for a grid length of 100', () => {
                expect(testGrid.grid.length).toBe(100)
            })
            test('findIndex returns a grid index from x y coordinates', () => {
                expect(testGrid.findIndex("00")).toBe(testGrid.grid[0])
                expect(testGrid.findIndex("50")).toBe(testGrid.grid[50])
                expect(testGrid.findIndex('99')).toBe(testGrid.grid[99])
            })
            test('findCoords returns the grid coordinates from an index', () => {
                expect(testGrid.findCoords(0)).toBe(testGrid.grid[0][0], testGrid.grid[0][1])
            })
            
            // test('set player should set player 1 to initialize then toggle players')
           
            
        })
    })


