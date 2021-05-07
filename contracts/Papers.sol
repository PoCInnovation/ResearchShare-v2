pragma solidity ^0.8.4;

contract Papers {
    enum PaperState {onReview, Approved, Rejected}
    struct MetaData {
        string []fields;
        PaperState paperState;
    }

    struct FeedBack {
        string feedBack;
        // address Reviewer;

    }

    struct Version {
        string ipfsHash;
        MetaData md;
        FeedBack[] feedBacks;
    }

    struct Paper {
        Version[] versions;
        // address Owner;
    }

    Paper[] papers;
    event NewPaperState(string indexed _ipfsHash, PaperState indexed _newState);


    function getPaperState(string memory _ipfsHash) public view returns (PaperState) {
        MetaData memory _md = getMetadata(_ipfsHash);
        return _md.paperState;
    }

    function getMetadata(string memory _ipfsHash) public view returns (MetaData memory) {
        Version memory _v = getVersion(_ipfsHash);
        return _v.md;
    }


    function getPaperId(string memory _ipfsHash) public view returns (uint) {
        for (uint i = 0; i < papers.length; i++) {
            for (uint j = 0; j < papers[i].versions.length; j++) {
                if (keccak256(abi.encodePacked(papers[i].versions[j].ipfsHash))
                == keccak256(abi.encodePacked(_ipfsHash))) {
                    return i;
                }
            }
        }
        revert("No paper found for such ipfsHash.");
    }

    function getVersion(string memory _ipfsHash) internal view returns (Version storage) {
        for (uint i = 0; i < papers.length; i++) {
            for (uint j = 0; j < papers[i].versions.length; j++) {
                if (keccak256(abi.encodePacked(papers[i].versions[j].ipfsHash))
                == keccak256(abi.encodePacked(_ipfsHash))) {
                    return papers[i].versions[j];
                }
            }
        }
        revert("No paper version found for such ipfsHash.");
    }

    function getLastVersion(uint _paperId) internal view returns (Version storage) {
        uint i = papers[_paperId].versions.length;
        return papers[_paperId].versions[i - 1];
    }

    // only reviewer
    function updatePaperState(uint _paperId, PaperState _newState) public {
        Version storage _v = getLastVersion(_paperId);
        require (_v.md.paperState > PaperState.onReview);
        _v.md.paperState = _newState;
        emit NewPaperState(_v.ipfsHash, _newState);
    }

   // only owner
    function updatePaper(uint _paperId, string memory _ipfsHash, MetaData memory _md) public {
        papers[_paperId].versions.push();
        uint i = papers[_paperId].versions.length - 1;
        Version storage _newVersion = papers[_paperId].versions[i];
        _newVersion.ipfsHash = _ipfsHash;
        _newVersion.md = _md;
        _newVersion.feedBacks.push();
        _newVersion.feedBacks[0].feedBack = "";
    }

    // only owner
    function addPaper(string memory _ipfsHash, MetaData memory _md) public {
        papers.push();
        Paper storage _newPaper = papers[papers.length - 1];
        _newPaper.versions.push();
        Version storage _firstVersion = _newPaper.versions[0];
        _firstVersion.ipfsHash = _ipfsHash;
        _firstVersion.md = _md;
        _firstVersion.feedBacks.push();
        _firstVersion.feedBacks[0].feedBack = "";
    }

    // only reviewer
    function addFeedBack(string memory _ipfsHash, string memory _feedBack) public {
        Version storage _v = getVersion(_ipfsHash);

        uint i = _v.feedBacks.length - 1;
        if (i == 0 && keccak256(abi.encodePacked(_v.feedBacks[0].feedBack))
        == keccak256(abi.encodePacked(""))) {
        // We did this because when we initialize the version, the feedback string is empty.
            _v.feedBacks[0].feedBack = _feedBack;
        } else {
            _v.feedBacks.push();
            i++;
            _v.feedBacks[i].feedBack = _feedBack;
        }
    }
}
