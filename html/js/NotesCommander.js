function NotesCommander (container, menu) {
    this.m_container = $(container);
    this.m_menu = $(menu);


    this.BuildMenu = function () {
        var html =
            '<nav class="navbar navbar-inverse">' +
            '<div class="container-fluid">' +
            '<div class="navbar-header">' +
            '<a class="navbar-brand" href="#">' +
            'Notes Commander' +
            '</a>' +
            '</div>' +

                    '<div class="btn-group pull-right" role="group">' +
                        '<button class="btn btn-success navbar-btn glyphicon glyphicon-refresh"' +
                        ' style="position: relative; top:0px;" id="refresh_documents"></button>' +
                        '<button class="btn btn-default navbar-btn glyphicon glyphicon-floppy-disk" id="save_document"' +
                        ' style="position: relative; top:0px;"></button>' +
                        '<button class="btn btn-default navbar-btn glyphicon glyphicon-file" id="new_document"' +
                        ' style="position: relative; top:0px;"></button>' +
                        '<button class="btn btn-danger navbar-btn glyphicon glyphicon-trash" id="delete_document"' +
                        ' style="position: relative; top:0px;"></button>' +
                    '</div>' +

            '</div>' +
            '</nav>';

        this.m_menu.html(html);
    };

    this.BuildControls = function () {
        this.BuildMenu();
        var html =
            '<div class="col-md-2">' +
            //'<div class="panel panel-default">' +
            //'<div class="panel-body">' +
                '<div class="row" id="controls">' +


                '</div>' +
                '<div class="row">' +
                    '<ul class="list-group" id="documents_list"></ul>' +
                '</div>' +
            //'</div>' +
            //'</div>' +
            '</div>' +

            '<div class="col-md-5">' +
            '<div class="panel panel-default">' +
            '<div class="panel-heading">Editor' +
            '</div>' +
            '<div class="panel-body" id="markdown_div">' +
                '<div class="row">' +
                    '<input class="form-control" style="width: 100%;" id="doc_name" type="text"></input>' +
                '</div>' +
                '<div class="row">' +
                    '<textarea class="form-control" style="width: 100%; height: 500px;" id="markdown"></textarea>' +
                '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="col-md-5">' +
            '<div class="panel panel-default">' +
            '<div class="panel-heading">Preview' +
            '</div>' +
            '<div class="panel-body">' +
                '<div id="display" style="overflow: auto; width: 100%; height: 500px;"></div>' +
            '</div>' +
            '</div>' +
            '</div>';



        this.m_container.html(html);

        this.m_markdown = $('#markdown');
        this.m_display = $('#display');
        this.m_controls = $('#controls');
        this.m_docList = $('#documents_list');
        this.m_docName = $('#doc_name');
        this.m_currentId = '';

        this.m_markdown.on('change keyup paste', this, this.UpdateDisplay);
        $('#save_document').on('click', this, this.SaveDocument);
        $('#refresh_documents').on('click', this, this.GetDocuments);
        $('#delete_document').on('click', this, this.DeleteDocument);
        $('#new_document').on('click', this, this.NewDocument);

        this.GetDocuments({data: this});
        this.NewDocument({data: this});

    };

    this.Request = function (req, callback) {
        $.post('/api', JSON.stringify(req), callback, 'json');
    };

    this.UpdateDisplay = function (ev) {
        var self = ev.data;
        self.m_display.html(markdown.toHTML(self.m_markdown.val()));
    };

    this.SaveDocument = function (ev) {
        var self = ev.data;
        var req = {
            doc: self.m_markdown.val(),
            name: self.m_docName.val(),
            reqtype: 'saveDocument'
        };

        if (self.m_currentId != '') {
            req['id'] = self.m_currentId;
        }

        self.Request(
            req, function (resp) {
                self.GetDocuments({data: self});
            }
        );

    };

    this.NewDocument = function (ev) {
        self = ev.data;
        self.m_docName.val('Untitled');
        self.m_markdown.val('# Document Title');
        self.m_currentId = '';
        self.UpdateDisplay({data: self});
    };

    this.LoadDocument = function (ev) {
        var self = ev.data;
        var req = {
            id: {'$oid': $(ev.target).attr('id')},
            reqtype: 'loadDocument'
        };

        self.Request(req,
            function (resp) {
                self.m_markdown.val(resp.doc);
                self.m_docName.val(resp.name);
                self.m_currentId = resp._id;
                self.UpdateDisplay({data: self});
            }
        );
    };

    this.DisplayDocumentsList = function (docs) {
        html = '';
        for (doc in docs) {
            html = html + '<li class="list-group-item"><a id="' + docs[doc]['id'] + '">' +
                docs[doc]['name'] + '</a></li>';
        }
        $('#documents_list').html(html);

        for (doc in docs) {
            $('#' + docs[doc]['id']).on('click', this, this.LoadDocument);
        }
    };

    this.GetDocuments = function (ev) {
        var self = ev.data;
        var req = {
            reqtype: 'getDocuments'
        };

        self.Request(req,
            function (resp) {
                console.log(resp);
                self.DisplayDocumentsList(resp.docs);
            }
        );
    };

    this.DeleteDocument = function (ev) {
        var self = ev.data;

        if (self.m_currentId == '') {
            return;
        }

        var req = {
            reqtype: 'deleteDocument',
            id: self.m_currentId
        };

        self.Request(req, function (resp) {
            if (resp.status == 'success') {
                self.NewDocument({data: self});
                self.GetDocuments({data: self});
            }
        });
    }

}
