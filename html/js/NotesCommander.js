function NotesCommander (container) {
    this.m_container = $(container);

    this.BuildControls = function () {
        var html =
            '<div id="markdown_div">' +
            '<textarea id="markdown"></textarea>' +
            '</div>' +
            '<div id="display"></div>' +
            '<div id="controls">' +


            '<button id="save_document">Save Document</button>' +
            '<button id="open_document">Open Document</button>' +
            '<select id="documents_list"></select>' +

            '</div>';


        this.m_container.html(html);

        this.m_markdown = $('#markdown');
        this.m_display = $('#display');
        this.m_controls = $('#controls');
        this.m_docList = $('#documents_list');

        this.m_markdown.on('change keyup paste', this, this.UpdateDisplay);
        $('#save_document').on('click', this, this.SaveDocument);
        $('#open_document').on('click', this, this.GetDocuments);
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
            name: 'FirstDocument',
            reqtype: 'saveDocument'
        };

        self.Request(
            req, function (resp) {
                console.log(resp);
            }
        );

    };

    this.DisplayDocumentsList = function (docs) {
        html = '';
        for (var doc in docs) {
            html = 
        }
    };

    this.GetDocuments = function (ev) {
        var self = ev.data;
        var req = {
            reqtype: 'getDocuments'
        };

        self.Request(req, function (resp) {console.log(resp);})

        self.DisplayDocumentsList(docs);
    };



}
