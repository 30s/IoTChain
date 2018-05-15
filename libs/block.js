/**
 *
 * The MIT License (MIT)
 *
 * http://block0.org
 *
 * Copyright (c) 2016-present Jollen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

'use strict';

var crypto = require('crypto');
var merkle = require('merkle');
var merkleRoot = merkle('sha256');

function Block(block) {
	if (typeof block === 'undefined') {
		block = {};
	}
	
	this.hash = block.hash || '';
	this.previousHash = block.previousHash || '';
	this.timestamp = block.timestamp || new Date();
	this.merkleRoot = block.merkleRoot || '0000000000000000000000000000000000000000000000000000000000000000';
    this.difficulty = block.difficulty || '00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
    this.txs = [];
    this.nonce = block.nonce || 0;
    this.no = block.no || 0;
    this._tree = [];
    this.numberMax = 4;
}

Block.prototype.setTransactions = function(txs) {
    this.txs = txs;

    this._tree = merkleRoot.sync(this.txs);
    this.merkleRoot = this._tree.level(0)[0];
};
Block.prototype.getNumberOfTransactions= function(){
    var levels = this._tree.levels();
    var nodes= this._tree.level(levels-1);
    return nodes.length;
};

Block.prototype.transactionsExist = function(txs) {
    var levels = this._tree.levels();
    var nodes= this._tree.level(levels-1);
    var i=0;
    
    for(i=0;i<levels;i++) {
        //console.log('Transaction #'+i+' : '+nodes[i]);
        if (nodes[i] == txs) return true ;
    }
    return false;
};

Block.prototype.getNumberMax = function(){
    return this.numberMax;
}

module.exports = Block;