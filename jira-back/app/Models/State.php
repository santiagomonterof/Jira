<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "is_finalized",
        "project_id",
        "order",
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    public function project()
    {
        return $this->belongsTo(Project::class, "project_id");
    }
}
