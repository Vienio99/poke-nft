// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PokeToken is ERC721, Ownable {
    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    uint256 COUNTER;

    uint256 fee = 1 ether;

    struct Pokemon {
        string name;
        uint256 id;
        uint256 dna;
        uint8 level;
        uint8 rarity;
    }

    Pokemon[] public pokemons;

    event NewPokemon(address indexed owner, uint256 id, uint256 dna);

    // Helpers
    function _createRandomNumber(uint256 _mod) internal view returns(uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return randomNumber % _mod;
    }

    function updateFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function withdrawFunds() external onlyOwner() {
        address _owner = owner();
        payable(_owner).transfer(address(this).balance);
    }


    // Creation
    function _createPokemon(string memory _name) internal {
        uint256 randomDna = _createRandomNumber(10**16);
        uint8 randomRarity = uint8(_createRandomNumber(100));
        Pokemon memory newPokemon = Pokemon(_name, COUNTER, randomDna, 1, randomRarity);
        pokemons.push(newPokemon);
        _safeMint(msg.sender, COUNTER);
        emit NewPokemon(msg.sender, COUNTER, randomDna);
        COUNTER++;
    }

    function createRandomPokemon(string memory _name) public payable {
        require(msg.value == fee, "The fee is not correct.");
        _createPokemon(_name);
    }

    // Getters
    function getPokemons() public view returns(Pokemon[] memory){
        return pokemons;
    }
}